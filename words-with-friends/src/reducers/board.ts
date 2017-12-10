import types from '../actions/types';
import { Board, PlaceTile, RemoveTile } from '../actions/interfaces';
import TileInfo from '../classes/TileInfo';
import Powerup from '../classes/Powerup';
import Tile from '../interfaces/Tile';

export default function board(currentBoard = new Map(), action: Board | PlaceTile | RemoveTile) {

    switch (action.type) {

        case types.INIT_BOARD:
            return initializeBoard();
        case types.PLACE_TILE:
            return placeTile(currentBoard, action.coordinates, action.tile);
        case types.REMOVE_TILE:
            return removeTile(currentBoard, action.coordinates);

        default:
            return currentBoard;
    }
}

function initializeBoard() {

    const boardMap = new Map<string, TileInfo>();

    for (let i = 0; i < 15; i++) {

        for (let j = 0; j < 15; j++) {

            const tileInfo = new TileInfo();

            if (Math.random().toString()[2] === '2') {
                tileInfo.powerup = setPowerup();
            }

            boardMap.set(`${i}, ${j}`, tileInfo);
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

function placeTile(boardMap: Map<string, TileInfo>, coordinates: string, tile: Tile) {

    const boardCopy = new Map(boardMap);
    const tileInfo = boardCopy.get(coordinates)!;
    tileInfo.place(tile);
    boardCopy.set(coordinates, tileInfo);
    return boardCopy;
}

function removeTile(boardMap: Map<string, TileInfo>, coordinates: string) {

    const boardCopy = new Map(boardMap);

    const tileInfo = boardCopy.get(coordinates)!;
    tileInfo.reset();

    boardCopy.set(coordinates, tileInfo);

    return boardCopy;
}