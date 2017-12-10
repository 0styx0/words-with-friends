import { combineReducers } from 'redux';

import turn from './turn';
import Players from './Players';
import Tilebag from './Tilebag';
import board from './board';

const rootReducer = combineReducers({
    turn,
    Players,
    Tilebag,
    board
});

export default rootReducer;