/**
 * @file App.js
 * @description Main Application Container.
 */

import React from 'react'
import Preview from '../Preview/Preview'
import Parameters from '../Parameters/Parameters'

import './App.css'

class App extends React.Component {

  render() {
    return (
      <main className="app">
        <Preview className="column"></Preview>
        <Parameters className="column"></Parameters>
      </main>
    )
  }
}

export default App
