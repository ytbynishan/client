import { Poppins } from 'next/font/google'

const font = Poppins({weight:['100' , '200' , '300' , '400' , '500' , '600' ,'700' , '800' , '900'] , subsets:['latin']})


export default function Header() {
  return (
    <div style={font.style} className={`bg-violet-900 text-white w-full py-5 px-8`}>
      <h1 className='text-2xl  font-semibold tracking-wider'>Youtube Mp3 play List Downloader...</h1>
    </div>
  )
}
