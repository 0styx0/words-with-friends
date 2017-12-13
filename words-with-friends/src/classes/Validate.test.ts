
describe('Validate', () => {

    describe('#travelHorizontally', () => {

        it('stops if callback returns `false`', () => {

        });

        it('only travels in the line specified (nowhere else)', () => {

        });

        it('calls `callback` param on every space it comes across', () => {

        });

        it('can go backwards', () => {

        });

        it(`doesn't go past the end of the board`, () => {

        });

        it(`doesn't go past the start of the board (when forwards = false)`, () => {

        });
    });

    describe('#travelVertically', () => {

        it('stops if callback returns `false`', () => {

        });

        it('only travels in the line specified (nowhere else)', () => {

        });

        it('calls `callback` param on every space it comes across', () => {

        });

        it('can go down-up', () => {

        });

        it(`doesn't go past the bottom of the board`, () => {

        });

        it(`doesn't go past the top of the board (when up = false)`, () => {

        });
    });

    describe('#getWords', () => {

        it('gets full word when given a coordinate in the middle of a vertical word', () => {

        });

        it('gets full word when given a coordinate in the middle of a horizontal word', () => {

        });

        it('gets all words that connect directly to coordinates (perpendicularly)', () => {

        });

        it('gets all words that connect directly to coordinates (parallel)', () => {

        });
    });

    describe('#checkForCenterTile', () => {

        describe('returns false if', () => {

            it('center is not filled', () => {

            });

            it(`any tile doesn't connect to center`, () => {

            });
        });
    });

    describe('#validateWords', () => {

        describe('marks word as valid when', () => {

            it('it is an actual word', () => {

            });

            it(`it's horizontal`, () => {

            });

            it(`it's vertical`, () => {

            });

            it('is connected to another word perpendicularly', () => {

            });

            it('is connected to another word in parallel', () => {

            });

            it('is intersected by multiple perpendicular words', () => {

            });
        });

        describe('marks word as invalid when', () => {

            it(`it's not a real word`, () => {

            });

            it('intersects a word, making that word invalid', () => {

            });

            it(`isn't connected to the center`, () => {

            });

            it('is a real word, but random letters somewhere else on the board', () => {

            });
        });
    });
});