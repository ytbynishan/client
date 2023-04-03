"use client";
import axios from 'axios';
import {useRef, useState } from 'react'
import { RotatingLines , Triangle } from 'react-loader-spinner';


export default function Form() {

    const linkRef = useRef();
    const DownloadRef = useRef();

    const [download, setdownload] = useState(true)
    const [is_valid, setis_valid] = useState(true)
    const [is_load, setis_load] = useState(false)
    const [on_downloading, seton_downloading] = useState(false)
    const [songs, setsongs] = useState([])
    const [TimeToDownload, setTimeToDownload] = useState(false)
    const [Download_url, setDownload_url] = useState('#')
    const [Download_titile, setDownload_titile] = useState('')
    

    const HandleClipBoard = () => {
        navigator.clipboard.readText().then((text) => {
            linkRef.current.value = text
            setdownload(false)
        });
    }

    const HandleChange = (event) => {
        if(event.target.value.length === 0)
        {
            setdownload(true)
        }
        else
        {
            setdownload(false)
        }
    }
    const HandleDownload = async () => {
        setis_load(true)
        setis_valid(true)
        setsongs([])
        try{
            if(new URL(linkRef.current.value).hostname === "www.youtube.com")
            {
                if(new URLSearchParams(new URL(linkRef.current.value).search).has('list'))
                {
                    const url = linkRef.current.value
                    const response_1 = await axios.post(`/api/get-songs`  , { url:url });
                    if(response_1.status === 200)
                    {
                        setsongs(response_1.data.videoTitles)
                        seton_downloading(true)

                        const response_2 = await axios.post(`/api/download` , {urls:response_1.data.videoLinks , names:response_1.data.videoTitles} , {timeout:3600000});
                        console.log(response_2.status)

                        if(response_2.status === 200)
                        {
                            seton_downloading(false)
                            const liku = `${response_2.data.url.content.download_url}`
                            setDownload_url(liku)
                            setDownload_titile(response_2.data.title)
                            setTimeToDownload(true);
                        }
                    }
                    
                }
                else
                {
                    setis_load(false)
                    setis_valid(false)
                    setsongs([])
                }
            }
            else
            {
                setis_load(false)
                setis_valid(false)
                setsongs([])
            }
        }
        catch(e){
            setis_load(false)
            setis_valid(true)
            setsongs([])
            console.error(e.message)
        }
    }
    

    return (
        <div className={``}>
            <div className='w-[85%]  md:w-1/2 mt-20 mx-auto bg-zinc-50 h-[245px] relative drop-shadow-2xl p-10'>
                <div className='w-full flex justify-center flex-col'>
                    <label className={`text-md capitalize`} htmlFor="link">Paste your youtube playlist link here</label>
                    <div className='flex w-full mt-3'>
                        <input onChange={HandleChange} ref={linkRef} className={`p-3 h-[45px] transition duration-300 focus:border-violet-700 bg-slate-50 flex-1 outline-none  text-sm  border border-slate-300`} id='link' type="text" />
                        <button onClick={HandleClipBoard} className='p-3  bg-violet-700 text-white h-[45px]'><i className="fa fa-clipboard" aria-hidden="true"></i></button>
                    </div>
                    <button disabled={download} onClick={HandleDownload} className={`mt-3 p-3 w-full bg-zinc-700 hover:bg-zinc-600 transition duration-200 text-white`}>Download</button>
                    {!is_valid && <p className={`text-red-600 mt-2 text-center`}>Invalid or unsupported url detect! (note: you can use youtube playlist url links only)</p>}
                </div>
                {on_downloading && 
                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-black/80 flex-col text-white text-md'>
                    <h1 className={`text-2xl`} >Please wait...</h1>
                    <p className={`mt-2 text-sm font-light`} >your file will be here soon</p>
                    <h1 className='mt-5'><Triangle
                    height="60"
                    width="60"
                    color="#4fa94d"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                    /></h1>
                </div>}
                
            </div>

            <div className='min-w-1/2 min-h-[250px] relative mx-auto mt-20 px-5 flex justify-center h-fit mb-20'>
                    <ul className='space-y-8 text-zinc-900 text-center'>
                        {songs && songs.map( (song , index) => {
                             return(
                                <li key={song}><p className={`text-left`}>{index + 1}.<i className="fa fa-youtube-play px-2" aria-hidden="true"></i>{song}</p></li>
                             )
                        })}
                    </ul>

                    {is_load && songs.length === 0 && 
                        <div className='absolute top-0 left-0 h-full flex items-center justify-center w-full z-10'>
                            <h1>
                                <RotatingLines
                                strokeColor="rgba(76 ,29 ,149)"
                                strokeWidth="2"
                                animationDuration="0.4"
                                width="50"
                                visible={true}
                                />
                            </h1>
                        </div>
                    }
            </div>
            {TimeToDownload && <div className='fixed download items-center justify-center flex z-20 top-0 left-0 w-screen h-screen bg-black/50'>
                <div id='down-container' className='min-w-[300px] translate-y-[-40px] transition duration-300 delay-300 px-5 max-w-fit flex items-center justify-center rounded-sm h-[150px] bg-violet-900'>
                    <div className=' flex items-center w-full flex-col'>
                        <h1 className='text-md  text-white font-semibold'>{Download_titile}</h1>
                        <a href={Download_url} download target='_blank' className='py-3 px-5 bg-black text-white mt-5 rounded'>Download</a>
                        <button onClick={() => {setTimeToDownload(false)}} className="mt-2 text-red-600 uppercase">close</button>
                    </div>
                </div>
            </div>}
            
        </div>
    )
}
