import Tile from '../interfaces/Tile';

export default class Tilebag {

    // http://www.thewordfinder.com/wwf-point-values.php
    static readonly alphabet = new Set<(Tile & { amount: number })>([
        {
            letter: 'A', // default is A even though can be changed
            points: 0,
            amount: 2
        },
        {
            letter: 'A',
            points: 1,
            amount: 9
        },
        {
            letter: 'B',
            points: 4,
            amount: 2
        },
        {
            letter: 'C',
            points: 4,
            amount: 2
        },
        {
            letter: 'D',
            points: 2,
            amount: 5
        },
        {
            letter: 'E',
            points: 1,
            amount: 13
        },
        {
            letter: 'F',
            points: 4,
            amount: 2
        },
        {
            letter: 'G',
            points: 3,
            amount: 3
        },
        {
            letter: 'H',
            points: 3,
            amount: 4
        },
        {
            letter: 'I',
            points: 1,
            amount: 8
        },
        {
            letter: 'J',
            points: 10,
            amount: 1
        },
        {
            letter: 'K',
            points: 5,
            amount: 1
        },
        {
            letter: 'L',
            points: 2,
            amount: 4
        },
        {
            letter: 'M',
            points: 4,
            amount: 2
        },
        {
            letter: 'N',
            points: 2,
            amount: 5
        },
        {
            letter: 'O',
            points: 1,
            amount: 8
        },
        {
            letter: 'P',
            points: 4,
            amount: 2
        },
        {
            letter: 'Q',
            points: 10,
            amount: 1
        },
        {
            letter: 'R',
            points: 1,
            amount: 6
        },
        {
            letter: 'S',
            points: 1,
            amount: 5
        },
        {
            letter: 'T',
            points: 1,
            amount: 7
        },
        {
            letter: 'U',
            points: 2,
            amount: 4
        },
        {
            letter: 'V',
            points: 5,
            amount: 2
        },
        {
            letter: 'W',
            points: 4,
            amount: 2
        },
        {
            letter: 'X',
            points: 8,
            amount: 1
        },
        {
            letter: 'Y',
            points: 3,
            amount: 2
        },
        {
            letter: 'Z',
            points: 10,
            amount: 1
        }
    ]);

    tiles: Tile[] = [];

    /**
     * Generates all tiles needed in Tilebag
     */
    constructor() {

        this.tiles = Array.from(Tilebag.alphabet).reduce((tiles, letter) => {

            for (let i = 0; i < letter.amount; i++) {
                tiles = tiles.concat(letter);
            }

            return tiles;

        }, [] as Tile[]);
    }

    /**
     * Gets a tile and removes it from the Tilebag
     */
    getRandomTile(playerIndex: number) {

        const tileToFind = this.tiles[Math.floor(Math.random() * this.tiles.length)];

        const tileToGet = this.removeTile(tileToFind);

        tileToGet.playerIndex = playerIndex;
        return tileToGet;
    }

    /**
     * Removes tile from bag
     */
    private removeTile(tile: Tile): Tile {

        const positionOfTile = this.tiles.indexOf(tile);
        return JSON.parse(JSON.stringify(this.tiles.splice(positionOfTile, 1)[0]));
    }
}
