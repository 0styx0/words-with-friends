import types from '../actions/types';
import { Board, PlaceTileOnBoard, RemoveTileFromBoard, ClearRecentStatusFromTiles } from '../actions/interfaces';
import TileInfo from '../classes/TileInfo';
import Powerup from '../classes/Powerup';
import Tile from '../interfaces/Tile';
import BoardClass from '../classes/Board';
import Player from '../classes/Player';

export default function board(
    currentBoard: BoardClass = new BoardClass(),
    action: Board | PlaceTileOnBoard | RemoveTileFromBoard | ClearRecentStatusFromTiles
) {

    switch (action.type) {

        case types.INIT_BOARD:
            return initializeBoard();
        case types.PLACE_TILE_ON_BOARD:
            return placeTile(currentBoard, action.coordinates, action.tile, action.currentPlayer, action.currentTurn);
        case types.REMOVE_TILE_FROM_BOARD:
            return removeTile(currentBoard, action.coordinates);
        case types.CLEAR_RECENT_STATUS_FROM_BOARD:
            return clearRecentStatus(currentBoard, action.recentlyPlacedCoordinates);
        default:
            return currentBoard;
    }
}

function initializeBoard() {

    const boardMap = new BoardClass();

    for (let y = 0; y < +process.env.REACT_APP_BOARD_DIMENSIONS!; y++) {

        for (let x = 0; x < +process.env.REACT_APP_BOARD_DIMENSIONS!; x++) {

            const tileInfo = new TileInfo();

            if (Math.random().toString()[2] === '2') {
                tileInfo.powerup = setPowerup();
            }

            boardMap.set([x, y], tileInfo);
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

function placeTile(
    boardMap: BoardClass, coordinates: number[], tile: Tile, currentPlayer: Player, currentTurn: number
) {

    const boardCopy = boardMap.clone();
    const tileInfo = boardCopy.get(coordinates) || new TileInfo();
    tileInfo.place(tile, currentPlayer, currentTurn);
    boardCopy.set(coordinates, tileInfo);

    return boardCopy;
}

function removeTile(boardMap: BoardClass, coordinates: number[]) {

    const boardCopy = boardMap.clone();

    const tileInfo = boardCopy.get(coordinates)!;
    tileInfo.reset();

    boardCopy.set(coordinates, tileInfo);

    return boardCopy;
}

function clearRecentStatus(
    boardMap: Readonly<BoardClass>,
    recentlyPlacedCoordinates: ReadonlyArray<ReadonlyArray<number>>
) {

    const boardCopy = boardMap.clone();

    recentlyPlacedCoordinates.forEach(coordinate => {

        const value = boardCopy.get(coordinate)!;

        boardCopy.set(coordinate, value);
    });

    return boardCopy;
}
