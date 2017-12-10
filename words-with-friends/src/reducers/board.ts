import types from '../actions/types';
import { Board } from '../actions/interfaces';
import TileInfo from '../classes/TileInfo';
import Powerup from '../classes/Powerup';

export default function board(currentBoard = new Map(), action: Board) {

    switch (action.type) {

        case types.INIT_BOARD:
            console.log(initializeBoard());
            return initializeBoard();

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

