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

        this.forEach((value: Readonly<TileInfo>, key: string) => {

            if (value.tile && value.Player) {

                const tileInfoClone = new TileInfo();
                const tileClone = JSON.parse(JSON.stringify(value.tile));

                tileInfoClone.place(tileClone, value.Player.clone(), value.turnTileWasPlaced);
                tileInfoClone.powerup = value.powerup;

                copy.set(this.convertIntStringIntoArray(key), tileInfoClone);

            } else {

                const tileInfo = new TileInfo();
                tileInfo.powerup = value.powerup;

                copy.set(this.convertIntStringIntoArray(key), tileInfo);
            }
        });

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

