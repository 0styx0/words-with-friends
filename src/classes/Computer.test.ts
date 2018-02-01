import placeWord from '../test/helpers/placeWord';
import getWord from '../test/helpers/getWord';
import Computer from './Computer';
import visualizeBoard from '../test/helpers/board.visualize';
import * as casual from 'casual';

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
});