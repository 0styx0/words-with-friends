import * as React from 'react';
import Game from './components/Game/Game';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class App extends React.Component {

  render(): any {

    return <Game />;
  }
}

export default App;
