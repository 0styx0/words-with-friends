import types from '../actions/types';
import { Board, PlaceTileOnBoard, RemoveTileFromBoard } from '../actions/interfaces';
import TileInfo from '../classes/TileInfo';
import Powerup from '../classes/Powerup';
import Tile from '../interfaces/Tile';
import BoardType from '../interfaces/Board';

export default function board(
    currentBoard: BoardType = new Map(), action: Board | PlaceTileOnBoard | RemoveTileFromBoard
) {

    switch (action.type) {

        case types.INIT_BOARD:
            return initializeBoard();
        case types.PLACE_TILE_ON_BOARD:
            return placeTile(currentBoard, action.coordinates, action.tile);
        case types.REMOVE_TILE_FROM_BOARD:
            return removeTile(currentBoard, action.coordinates);

        default:
            return currentBoard;
    }
}

function initializeBoard() {

    const boardMap = new Map<number[], TileInfo>();

    for (let i = 0; i < +process.env.BOARD_DIMENSIONS!; i++) {

        for (let j = 0; j < +process.env.BOARD_DIMENSIONS!; j++) {

            const tileInfo = new TileInfo();

            if (Math.random().toString()[2] === '2') {
                tileInfo.powerup = setPowerup();
            }

            boardMap.set([i, j], tileInfo);
        }
    }

    return boardMap;
}

/**
 * Randomly sets powerups
 */
function setPowerup(): Powerup | undefined {

    return new Powerup(Math.random() > 0.5 ? 'letter' : 'word', Math.random() > 0.5 ? 2 : 3);
}

function placeTile(boardMap: BoardType, coordinates: number[], tile: Tile) {

    const boardCopy = new Map(boardMap);
    const tileInfo = boardCopy.get(coordinates)!;
    tileInfo.place(tile);
    boardCopy.set(coordinates, tileInfo);
    return boardCopy;
}

function removeTile(boardMap: BoardType, coordinates: number[]) {

    const boardCopy = new Map(boardMap);

    const tileInfo = boardCopy.get(coordinates)!;
    tileInfo.reset();

    boardCopy.set(coordinates, tileInfo);

    return boardCopy;
}