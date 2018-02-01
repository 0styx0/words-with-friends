import Board from '../../classes/Board';

/**
 * console.logs letters in board in the shape of a board
 *
 * @param board - regular map of board
 */
export default function visualizeBoard(board: Board) {

    const copy = board.clone();

    const boardArr = Array.from(copy).reduce((accum = [], twoD) => {

        const keys = twoD[0].split(/[^\d]\s/);
        const x = +keys[0], y = +keys[1];

        if (!accum[y]) {
            accum[y] = [];
        }

        if (twoD[1].filled) {
            accum[y][x] = twoD[1]!.tile!.letter!;
        } else {
            accum[y][x] = '–';
        }

        return accum;

    }, [] as string[][]);

    console.log('\n');
    console.log(boardArr);
    console.log('\n');
}