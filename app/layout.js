import './globals.css'

export const metadata = {
  title: 'PlaylistDownloader By Nishan',
  description: 'youtube playlist downloader',
}

import { Poppins } from 'next/font/google'

const font = Poppins({weight:['100' , '200' , '300' , '400' , '500' , '600' ,'700' , '800' , '900'] , subsets:['latin']})


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      </head>
      <body >{children}</body>
    </html>
  )
}
