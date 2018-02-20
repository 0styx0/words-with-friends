import Validate from './Validate';
import TileInfo from './TileInfo';
import Board from './Board';

class Word {

    /**
     * Adds up points that a word is worth
     */
    static tallyPoints(board: Board, recentlyPlacedCoordinates: number[][]) {

        const validate = new Validate(board);
        const words = validate.getWords(recentlyPlacedCoordinates);

        function calculateTileMultipliers(tileInfoWords: TileInfo[][]) {

            return tileInfoWords.reduce((accum: number, word) => {

                const wordMultipliers: number[] = [];

                const individualTilePoints = word.map(tile => {

                    if (tile.powerup && tile.powerup.target === 'word') {
                        wordMultipliers.push(tile.powerup.multiplyBy);
                    }

                    // console.log(tile.tile!.letter, tile.tile!.points, tile.powerup, tile.calculateValue());
                    return tile.calculateValue();

                }).reduce((addedPoints, points) => addedPoints + points, 0);

                const total = wordMultipliers.reduce((multiplied, multiplier) =>
                    multiplier * multiplied, individualTilePoints);

                return accum + total;
            }, 0);
        }

        const totalPoints = calculateTileMultipliers(words);

        return totalPoints;
    }

}

export default Word;
