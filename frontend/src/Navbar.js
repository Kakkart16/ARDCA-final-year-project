import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import sentiment from './assets/sentiment.png'
const Navbar = () => {
  return (
    <div className='bg-sky-900 text-gray-50 items-center sticky top-0 z-50'>
      <div className='flex flex-row justify-between p-4'>

        <div className='h-14'> 
          <img src={sentiment} alt="" className='h-full'/>
        </div>  

        <div className='flex flex-row text-base font-semibold items-center'>
          <div className='px-4'> <button>Home</button> </div>
          <div className='px-4'> <button>Contact Us</button> </div>
          <div className='px-4 hover:cursor-pointer'> <AccountCircleIcon style={{ color: 'white', fontSize: 30 }}/> </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar