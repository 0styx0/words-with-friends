import * as React from 'react';
import './App.css';
import HandContainer from './components/Hand/Hand';

import Board from './components/Board/Board';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class App extends React.Component {

  render(): any {
    return (
        <div>
          <HandContainer />
          <Board />
          <HandContainer className="rightHand" />
        </div>
    );
  }
}

export default App;
