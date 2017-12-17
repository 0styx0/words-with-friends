import TileInfo from '../../src/classes/TileInfo';

/**
 * console.logs letters in board in the shape of a board
 *
 * @param board - regular map of board
 */
export default function visualizeBoard(board: Map<string, TileInfo>) {

    const copy = new Map(board);

    const boardArr = Array.from(copy).reduce((accum = [], twoD) => {

        const keys = twoD[0].split(/[^\d]\s/);
        const x = +keys[0], y = +keys[1];

        if (!accum[x]) {
            accum[x] = [];
        }

        if (twoD[1].filled) {
            accum[x][y] = twoD[1]!.tile!.letter!;
        } else {
            accum[x][y] = '–';
        }

        return accum;

    }, [] as string[][]);

    console.log('\n');
    console.dir(boardArr);
    console.log('\n');
}