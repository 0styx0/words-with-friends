import * as React from 'react';
import './App.css';
import Game from './classes/Game';

// import Board from './components/Board/Board';
// import ControlsContainer from './components/Controls/Controls';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class App extends React.Component {

  render(): any {

    return <Game />;
  }
}

export default App;
