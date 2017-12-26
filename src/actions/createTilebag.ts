import { ResetTilebag } from './interfaces';
import types from './types';

export default function resetTilebag(currentTurn: number): ResetTilebag {
    return {
        type: types.RESET_TILEBAG
    };
}