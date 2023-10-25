import React from 'react'
import SginInButton from './SignInButton'


const Appbar = () => {
  return (
    <header className='flex gap-4 p-4 bg-gradient-to-b from-white to-gray-200 shadow'>
        <SginInButton/>
    </header>
  )
}

export default Appbar