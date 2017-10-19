import * as React from 'react';
import './App.css';
import Hand from './components/Hand';

// import Tile from './components/Tile/';
import Board from './components/Board/Board';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class App extends React.Component {

  render(): any {
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
