'use client'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useSession } from 'next-auth/react'
import React from 'react'
// This function can be marked `async` if using `await` inside

// async function getSessionData() {
//     const {data: session} = await useSession();
//     console.log({session})
//     return (session && session.user);
//   }


  //consider comparing session token value to this:
  //next-auth.session-token
export function middleware(request: NextRequest) {

    const allCookies = request.cookies.getAll();
    console.log(allCookies);

    // if (!request.cookies.has('next-auth.session-token'))
    //     return NextResponse.redirect(new URL('/login', request.url))    
    // let cookie = request.cookies.get('next-auth.session-token');
    // if (cookie != <figure out how to get the correct token value>)
    //     return NextResponse.redirect(new URL('/login', request.url))



    // if (!getSessionData()) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    //   }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/about/:path*'
    ,'/middle/(.*)' 
    // , '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}