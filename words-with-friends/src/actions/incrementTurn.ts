import { Turn } from './interfaces';
import types from './types';

export default function incrementTurn(currentTurn: number): Turn {
    return {
        type: types.INCREMENT_TURN,
        turn: currentTurn,
    };
}