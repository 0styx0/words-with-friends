import placeWord from '../test/helpers/placeWord';
import getWord from '../test/helpers/getWord';
import Validate from './Validate';
import TileInfo from './TileInfo';
import * as sinon from 'sinon';
import * as casual from 'casual';
import Board from './Board';


describe('TileInfo', () => {

    describe('when created', () => {

        it('is not filled', () => {

        });

        it('has no tile', () => {


        });

        it('has no Player', () => {


        });

        it('is not worth any points', () => {


        });

        it('cannot be dragged', () => {


        });
    });

    describe('when `#place`d', () => {

        test('filled = true', () => {


        });

        test('recent = true', () => {


        });

        test('.canDrag = true', () => {


        });

        test('.Player is current Player', () => {


        });

        test('.tile is same as the one placed', () => {


        });
    });

    describe('#calculateValue is correct for tile with', () => {

        test('no powerup', () => {


        });

        test('letter powerup', () => {


        });

        test('word powerup', () => {


        });

        test('no tile', () => {


        });
    });

    describe('when a turn has passed', () => {

        it('.canDrag = false', () => {


        });
    });
    describe('#reset', () => {

        it('makes TileInfo like new', () => {


        });
    });
});