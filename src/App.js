import React, { Component } from 'react'
import './App.css'
import Tab from './Tab'
import data1 from './signature_integrated_hdbscan.json'
import data2 from './signature_integrated_sitka.json'
import logo from './logo.svg';



class App extends Component {
   render() {
   return (
      <div className='App'>
      <div>
      <p>HDBSCAN</p>
      <Tab data={data1}/>
      <p>Sitka</p>
      <Tab data={data2}/>
      </div>
      </div>
   )
   }
}

export default App
