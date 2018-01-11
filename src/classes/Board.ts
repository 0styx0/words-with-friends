import TileInfo from './TileInfo';

export default class Board extends Map {

    constructor() {
        super();
    }

    set(coordinates: ReadonlyArray<number>, value: Readonly<TileInfo>) {
        return super.set(`${coordinates[0]}, ${coordinates[1]}`, value);
    }

    get(coordinates: ReadonlyArray<number>): Readonly<TileInfo> | undefined {
        return coordinates ? super.get(`${coordinates[0]}, ${coordinates[1]}`) : undefined;
    }

    clone() {

        const copy = new Board();

        this.forEach((value: Readonly<TileInfo>, key: string) =>
            copy.set(this.convertIntStringIntoArray(key), value));

        return copy;
    }

    /**
     * @param coordinate - 'n, n' where n is a digit
     *
     * @return [n, n] where n is coerced to number
     */
    private convertIntStringIntoArray(coordinate: string) {

        const keys = coordinate.split(/[^\d]\s/);

        return keys.map(key => +key);
    }
}