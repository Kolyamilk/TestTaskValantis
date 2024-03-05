import { useState } from 'react'
import API from './API'
import md5 from 'md5'
import Header from './Header'
import Sidebar from './Sidebar'


import './App.css'

function App() {

  return (

    <>
      <Header />
      <Sidebar />
      <h1>Товары</h1>
      <API />
    </>
  )
}
export default App
