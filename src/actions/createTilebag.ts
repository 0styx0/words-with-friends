import { ResetTilebag } from './interfaces';
import types from './types';

export default function resetTilebag(): ResetTilebag {
    return {
        type: types.RESET_TILEBAG
    };
}