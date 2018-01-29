import TileInfo from '../../classes/TileInfo';
import Tilebag from '../../classes/Tilebag';
import store, { getState, defaultState } from '../../store';
import Board from '../../classes/Board';


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
    word: string, startCoordinate: ReadonlyArray<number>, horizontal: boolean = true,
    board: Readonly<Board> = new Board(),
    turn: number = 1
) {

    const boardCopy = board.clone();

    const initialCoordinates = [...startCoordinate];
    const coordinates: [number, number][] = [];

    if (boardCopy.size === 0) {

        for (let y = 0; y < +process.env.REACT_APP_BOARD_DIMENSIONS!; y++) {
            for (let x = 0; x < +process.env.REACT_APP_BOARD_DIMENSIONS!; x++) {
                boardCopy.set([x, y], new TileInfo());
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
            playerIndex: (store.getState() as typeof defaultState).Players.findIndex(player => player.turn)
        };

        tileInfo.place(tile, getState().Players[0], turn);
        tileInfos.push(tileInfo);

        return tileInfo;
    }

    if (horizontal) {

        let currentX = initialCoordinates[0];

        while (wordArr.length > 0) {

            boardCopy.set([currentX, initialCoordinates[1]], setTileInfos());
            coordinates.push([currentX, initialCoordinates[1]]);
            currentX++;
        }
    } else {

        let currentY = initialCoordinates[1];

        while (wordArr.length > 0) {

            boardCopy.set([initialCoordinates[0], currentY], setTileInfos());
            coordinates.push([initialCoordinates[0], currentY]);
            currentY++;
        }
    }

    return {
        tileInfos,
        board: boardCopy,
        coordinates
    };
}