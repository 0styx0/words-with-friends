import { combineReducers } from 'redux';

import turn from './turn';
import Players from './Players';
import Player from './Player';
import Tilebag from './Tilebag';
import board from './board';


const rootReducer = combineReducers({
    turn,
    Players,
    Player,
    Tilebag,
    board
});

export default rootReducer;