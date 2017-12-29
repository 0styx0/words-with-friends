import TileInfo from './TileInfo';

export default class Board extends Map {

    constructor(board?: Readonly<Board>) {
        super();

        // copies board
        if (board) {
            board.forEach((value, key) => super.set(key, value));
        }
    }

    set(coordinates: ReadonlyArray<number>, value: Readonly<TileInfo>) {
        return super.set(`${coordinates[0]}, ${coordinates[1]}`, value);
    }

    get(coordinates: ReadonlyArray<number>): Readonly<TileInfo> | undefined {
        return coordinates ? super.get(`${coordinates[0]}, ${coordinates[1]}`) : undefined;
    }
}