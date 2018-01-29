import Tilebag from '../classes/Tilebag';
import { Turn } from './interfaces';
import types from './types';

export default function incrementTurn(currentTurn: number, tilebag: Tilebag): Turn {
    return {
        type: types.INCREMENT_TURN,
        turn: currentTurn,
        Tilebag: tilebag
    };
}