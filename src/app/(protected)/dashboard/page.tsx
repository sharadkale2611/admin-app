import React from 'react'
import Dashboard from './dashboard'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Dashboard",
};


function page() {
  return (
    <Dashboard/>
  )
}

export default page
