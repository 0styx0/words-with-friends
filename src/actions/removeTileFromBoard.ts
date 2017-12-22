import types from './types';

export default function removeTileFromBoard(coordinates: string) {
    return {
        type: types.REMOVE_TILE_FROM_BOARD,
        coordinates
    };
}