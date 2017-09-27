import Tile from '../interfaces/Tile';

class TileBag {

    private tiles: Tile[] = [];

    /**
     * Fills tilebag with Tiles
     */
    public init() {

    }

    /**
     * @return Tiles for a user's hand
     */
    public getHand(): Tile[] {

    }

    /**
     * @return Tiles to populate board
     */
    public getBoard() {

    }

    /**
     * Gets tiles from tilebag, taking those Tiles out of the bag
     *
     * @param amount - how many tiles to get
     *
     * @return tiles
     */
    private getTiles(amount: number) {

    }

    /**
     * Sets this.tiles
     */
    public generateTiles() {

        // http://www.thewordfinder.com/wwf-point-values.php
        const alphabet: (Tile & { amount: number })[] = [
            {
                letter: '',
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
        ];


        alphabet.reduce((tiles: Tile[], letter) => {

            for (let i = 0; i < letter.amount - 1; i++) {

            }
        }, []);
    }
}
