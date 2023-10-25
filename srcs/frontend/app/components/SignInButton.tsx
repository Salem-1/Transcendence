'use client'
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'


const SginInButton = () => {
    const {data: session } = useSession();
    console.log("hello");
    if (session && session.user)
    {
        console.log("hi");
        return (
            <div className='flex gap-4 ml-au'>
                <p className='text-sky-600'>
                    {session.user.name}
                    <button onClick={() =>signOut()} className='text-red-600'>
                        Sign Out
                    </button>
                   {session.user.email}
                   {session.user.image}
                   {session.expires}
                   {session.accessToken}
                    {/* {session.} */}
                </p>

            </div>
        )
    }
  return (
    <div>
        <button onClick={() =>signIn()} className='text-red-600'>
                        Sign In
            </button>
    </div>
  )
}

export default SginInButton
