import types from './types';

export default function initializeBoard() {
    return {
        type: types.INIT_PLAYERS
    };
}