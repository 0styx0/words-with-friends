import * as React from 'react';
import './App.css';
import Game from './classes/Game';

import Board from './components/Board/Board';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class App extends React.Component {

  render(): any {

    Game.init();

    return (
        <div>
          {Game.Players[0].hand}
          <Board />
          {Game.Players[1].hand}
        </div>
    );
  }
}

export default App;
