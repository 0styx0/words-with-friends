import * as React from 'react';
import Game from './components/Game/Game';
import { Provider } from 'react-redux';
import store from './store';
import * as dotEnv from 'dotenv-safe';
dotEnv.load();

class App extends React.Component {

  render(): any {

    return (
      <Provider store={store}>
        <Game />
      </Provider>
    );
  }
}

export default App;
