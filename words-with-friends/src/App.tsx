import * as React from 'react';
import './App.css';
import Hand from './components/Hand';

// import Tile from './components/Tile/';
import Board from './components/Board/';

class App extends React.Component {

  render() {
    return (
        <div>
          <Hand />
          <Board />
          <Hand className="rightHand" />
        </div>
    );
  }
}

export default App;
