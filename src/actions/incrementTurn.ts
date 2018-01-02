import { Turn } from './interfaces';
import types from './types';
import Tilebag from '../classes/Tilebag';

export default function incrementTurn(currentTurn: number, tilebag: Tilebag): Turn {
    return {
        type: types.INCREMENT_TURN,
        turn: currentTurn,
        Tilebag: tilebag
    };
}