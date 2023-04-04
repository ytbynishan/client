import { NextResponse , NextRequest } from "next/server";
import axios from "axios";
import urlquery from 'url';
import ytdl from "ytdl-core";
import JSZip from "jszip";



export async function POST(req:NextRequest) {

  //#region variables

    const  {data :{names , urls}} = await req.json();
    const git_url = process.env.GIT_URL
    const git_token = process.env.PERSONAL_ACCESS_TOKEN
    const db_url = process.env.DB_URL
    const db_apiKey = process.env.DB_API_KEY
//#endregion

//#region gathering mp3 files
    const gather = new Promise(async(resolve , reject) => {
      const mp3Array = []
      try
      {
        for(var i=0; i <urls.length; i++)
        {
          console.log(`${i+1}. ${names[i]} => ${urls[i]}`)

          var videoId = urlquery.parse(urls[i], true).query.v


          const chunks = [];
          
            const videoTitle = names[i];
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          
            const stream = ytdl(videoUrl, { filter: 'audioonly' })
            
            stream.on('data', async (chunk) => {
              chunks.push(chunk);
            });
            
            stream.on('end', () => {
              var buffer = Buffer.concat(chunks);
              mp3Array.push({name:videoTitle , data:buffer})
              buffer = null;
            });
            stream.on('finish', () => {
              console.log('File downloaded successfully');
              if(urls.length === mp3Array.length )
              {
                resolve(mp3Array)
              }
            });

            stream.on('error', (error) => {
              reject(error)
            });
        }
      }
      catch(e)
      {
        reject(e)
      }
    })
//#endregion

//#region genarate zip file ....
    const zipping = (mp3Array) => {
      return new Promise(async(resolve , reject) => {
        const zip = new JSZip();
        try
        {
          mp3Array.forEach(({name , data}) => {
          zip.file(`${name}.mp3`, data);
          });
          zip.generateAsync({ type: 'base64' }).then(async function(content) {
            resolve(content)
          })
        }
        catch(e)
        {
          reject(e)
        }
      })
    }
  //#endregion



  try
  {
    const mp3ArrayResponse =  await gather;
    const Bas64Content = await zipping(mp3ArrayResponse)
    const file_name = `Youtube_playlist${new Date().toLocaleTimeString()}.zip`
    const source_file_url =  `${git_url}/${file_name}`

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + git_token
      },
      timeout: 3600000 // 5 seconds
    };

    const response = await axios.put(source_file_url,{message:`Youtube_playlist${new Date().toLocaleTimeString()}`,content:Bas64Content} , options);

    // const db_response = await axios.post(`${db_url}/api/telling`,{name:file_name , url:source_file_url} , {headers: {'Authorization': 'Bearer ' + db_apiKey}})
    return NextResponse.json({msg:'done' , url:response.data , title:file_name})
  }
  catch(e)
  {
    return new Response(e)
  }
}




