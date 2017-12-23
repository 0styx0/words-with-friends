import TileInfo from './TileInfo';

export default class Board extends Map {

    constructor(board?: Board) {
        super();

        // copies board
        if (board) {
            board.forEach((value, key) => super.set(key, value));
        }
    }

    set(coordinates: number[], value: TileInfo) {
        return super.set(`${coordinates[0]}, ${coordinates[1]}`, value);
    }

    get(coordinates: number[]): TileInfo | undefined {

        return coordinates ? super.get(`${coordinates[0]}, ${coordinates[1]}`) : new TileInfo();
    }
}