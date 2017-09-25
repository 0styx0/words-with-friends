import * as chai from 'chai';

const expect = chai.expect;

describe('word checker', () => {

    describe('marks word as valid when', () => {

        it('only 1 word on the board and word starts from middle of board', () => {


        });

        it('connected to one word', () => {


        });

        it('connected with multiple words', () => {


        });
    });

    describe('marks word as invalid when', () => {

        it(`only one word and that word doesn't start from middle of board`, () => {


        });

        it(`word isn't connected to anything`, () => {


        });

        it('is not a real word', () => {


        });

        it('goes beyond edge of board', () => {


        });

        it('is a real word, but random letters somewhere else on the board', () => {


        });
    });

});
