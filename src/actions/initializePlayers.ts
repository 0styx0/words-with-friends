import types from './types';
import Tilebag from '../classes/Tilebag';

export default function initializePlayers(tilebag: Tilebag) {
    return {
        type: types.INIT_PLAYERS,
        Tilebag: tilebag
    };
}