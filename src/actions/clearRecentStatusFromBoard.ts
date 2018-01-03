import types from './types';
import { ClearRecentStatusFromTiles } from './interfaces';

export default function clearRecentStatusFromBoard(
    recentlyPlacedCoordinates: ReadonlyArray<ReadonlyArray<number>>
): ClearRecentStatusFromTiles {

    return {
        type: types.CLEAR_RECENT_STATUS_FROM_BOARD,
        recentlyPlacedCoordinates
    };
}