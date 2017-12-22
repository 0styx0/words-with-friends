import TileInfo from '../../src/classes/TileInfo';
import Tilebag from '../../src/classes/Tilebag';
import store, { defaultState } from '../../src/store';
import Board from '../../src/classes/Board';

new Board();

/**
 *
 * @param word - to put on board
 * @param startCoordinate - where to start the word [x, y]
 * @param horizontal - whether word should be placed horiontally or vertically
 * @param board - the board
 *
 * @return { board: boardWithWord, tileInfos: arrayOfInfoAboutLetters }
 */
export default function placeWord(
    word: string, startCoordinate: [number, number], horizontal: boolean = true,
    board: Board = new Board(),
    turn: number = 1
) {

    const boardCopy = new Board(board);

    const initialCoordinates = [...startCoordinate];
    const coordinates: [number, number][] = [];

    if (boardCopy.size === 0) {

        for (let i = 0; i < +process.env.BOARD_DIMENSIONS!; i++) {
            for (let j = 0; j < +process.env.BOARD_DIMENSIONS!; j++) {
                boardCopy.set([i, j], new TileInfo());
            }
        }
    }

    const tileInfos: TileInfo[] = [];
    const wordArr = word.split('');

    /**
     * @return TileInfo for first elt in wordArr
     */
    function setTileInfos() {

        const tileInfo = new TileInfo();
        const currentLetter = wordArr.shift()!;

        const tile = {
            letter: currentLetter,
            points: Array.from(Tilebag.alphabet).find(letter => letter.letter === currentLetter)!.points,
            playerIndex: (store.getState() as typeof defaultState).Players.findIndex(player => player.turn),
            turn
        };

        tileInfo.place(tile);
        tileInfos.push(tileInfo);

        return tileInfo;
    }

    if (horizontal) {

        let currentX = initialCoordinates[0];

        while (wordArr.length > 0) {

            boardCopy.set([initialCoordinates[1], currentX], setTileInfos());
            coordinates.push([initialCoordinates[1], currentX]);
            currentX++;
        }
    } else {

        let currentY = initialCoordinates[1];

        while (wordArr.length > 0) {

            boardCopy.set([currentY, initialCoordinates[0]], setTileInfos());
            coordinates.push([currentY, initialCoordinates[0]]);
            currentY++;
        }
    }

    return {
        tileInfos,
        board: boardCopy,
        coordinates
    };
}