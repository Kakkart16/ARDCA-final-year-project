import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import iconimage from './assets/iconimage.png';
import logo from './assets/icon-25-512.webp'
import sentiment from './assets/sentiment.png'
const Navbar = () => {
  return (
    <div className='w-screen bg-sky-900 text-gray-50 items-center'>
      <div className='w-full flex flex-row justify-between p-4'>

        <div className='h-14'> 
          <img src={sentiment} alt="" className='h-full'/>
        </div>  

        <div className='flex flex-row justify-evenly text-base font-semibold items-center'>
          <div className='px-4'> <button>Home</button> </div>
          <div className='px-4'> <button>Contact Us</button> </div>
          <div className='px-4 hover:cursor-pointer'> <AccountCircleIcon style={{ color: 'white', fontSize: 30 }}/> </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar