import reducers from './reducers';
import { createStore, compose } from 'redux';
import Player from './classes/Player';
import Tilebag from './classes/Tilebag';
import Board from './classes/Board';

const enhancers = compose('devToolsExtension' in window ?
    (window as {} as { devToolsExtension: Function }).devToolsExtension!() :
    (f: {}) => f);

export const defaultState = {
    turn: 0,
    Players: [new Player(true, 0), new Player(false, 1)], // turns switched around on INIT_PLAYERS
    board: new Board(),
    Tilebag: new Tilebag()
};

const store = createStore(reducers, defaultState, enhancers);

export default store;
