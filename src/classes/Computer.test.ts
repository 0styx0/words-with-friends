import placeWord from '../test/helpers/placeWord';
import getWord from '../test/helpers/getWord';
import Computer from './Computer';
// import visualizeBoard from '../test/helpers/board.visualize';

describe(`Computer`, () => {
    describe(`#findAllTiles`, () => {

        // put down random words
        it(`finds all words`, () => {

            const center = [7, 7];

            const words = [getWord(3)];
            const firstPlacement = placeWord(words[0], center, true);

            const lastLetterOfFirstWord = words[0][words[0].length - 1];

            do {
                words[1] = getWord();
            }
            while (words[1][0] !== lastLetterOfFirstWord);


            const secondWordCoordinates = [center[0] + words[0].length - 1, center[1]];
            const secondPlacement = placeWord(words[1], secondWordCoordinates, false, firstPlacement.board);


            const allCoordinates = new Set(
                firstPlacement.coordinates.
                    concat(secondPlacement.coordinates)
                    .filter((coordinate, i, coordinates) => {

                        const firstIndexOfCoordinate = coordinates.
                            findIndex(currentCoordinate =>
                                coordinate.toString() === currentCoordinate.toString());

                        return firstIndexOfCoordinate === i;
                    })
            );

            const coordinatesFoundByComputer = (new Computer(true, 1)).getAllFilledCoordinates(secondPlacement.board);

            expect(coordinatesFoundByComputer).toEqual(allCoordinates);
        });
    });

    describe(`#getMaximumHorizontalWordLength gets length of first coordinate + blank spaces`, () => {

        it(`until the last blank (if there's a word after the last blank)`, () => {

            const words = [getWord(3), getWord(3)];
            const coordinate = [[0, 7], [3, 7]];

            const firstPlacement = placeWord(words[0], coordinate[0], false);
            const secondPlacement = placeWord(words[1], coordinate[1], false, firstPlacement.board);

            const maximumLength = (new Computer(true, 1)).getMaximumHorizontalWordLength(secondPlacement.board, coordinate[0])


            const inclusiveCoordinateLength = coordinate[1][0] - coordinate[0][0];

            expect(maximumLength).toBe(inclusiveCoordinateLength - 1);
        });

        it(`goes until the edge of screen if needed`, () => {

            const word = getWord(3);
            const distanceFromEdge = 3;
            const coordinate = [+process.env.REACT_APP_BOARD_DIMENSIONS! - distanceFromEdge, 0];

            const firstPlacement = placeWord(word, coordinate, false);

            const maximumLength = (new Computer(true, 1)).
                getMaximumHorizontalWordLength(firstPlacement.board, coordinate);

            expect(maximumLength).toBe(distanceFromEdge);
        });

        it(`returns 0 if there's no blank spaces after`, () => {

            const word = getWord(3);
            const coordinate = [0, 0];

            const firstPlacement = placeWord(word, coordinate, true);

            const maximumLength = (new Computer(true, 1)).
                getMaximumHorizontalWordLength(firstPlacement.board, coordinate);

            expect(maximumLength).toBe(0);
        });
    });
});
