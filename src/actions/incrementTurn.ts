import { Turn } from './interfaces';
import types from './types';
import Tilebag from '../classes/Tilebag';
import Player from '../classes/Player';

export default function incrementTurn(currentTurn: number, tilebag: Tilebag, Players: Player[]): Turn {
    return {
        type: types.INCREMENT_TURN,
        turn: currentTurn,
        Tilebag: tilebag,
        Players
    };
}