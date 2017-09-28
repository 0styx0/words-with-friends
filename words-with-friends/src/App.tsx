import * as React from 'react';
import './App.css';

import Tile from './components/Tile/';

const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <table>
        <tr><td style={{width: '100px', height: '100px', position: 'relative'}}><Tile letter="A" points={12} /></td></tr>
        </table>
      </div>
    );
  }
}

export default App;
