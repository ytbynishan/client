import { NextResponse , NextRequest } from "next/server";
import axios from "axios";



export async function POST(request:NextRequest) {

    const {url} = await request.json()
    const playList_Id = new URLSearchParams(new URL(url).search).get('list')
    const youtube_api_key = process.env.YOUTUBE_API_KEY
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playList_Id}&key=${youtube_api_key}`)
    const videoLinks = response.data.items.map(item => `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`);
    const videoTitles = new Array();
    response.data.items.forEach(({snippet:{title}}) => {
        videoTitles.push(title)
    });
    return  NextResponse.json({videoLinks:videoLinks , videoTitles:videoTitles});

}