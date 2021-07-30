import React, { Component } from 'react'
import './App.css'
import Tab from './Tab'
import data from './test.json'

class App extends Component {
   render() {
   return (
      <div className='App'>
      <div>
      <Tab data={data}/>
      </div>
      </div>
   )
   }
}
export default App
