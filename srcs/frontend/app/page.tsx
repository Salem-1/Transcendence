"use client"
import Image from 'next/image'
import TestProfile from "./components/TestProfile"
import CampusData from './components/CampusData'
import Appbar from './components/Appbar'

export default function Home() {
  return (
    <div>
      <CampusData/>
    </div>
  )
}
