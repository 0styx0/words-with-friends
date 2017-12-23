import placeWord from '../test/helpers/placeWord';
import getWord from '../test/helpers/getWord';
import Validate from './Validate';
import TileInfo from './TileInfo';
import * as sinon from 'sinon';
import * as casual from 'casual';
import Board from './Board';
import Tilebag from './Tilebag';
import store, { defaultState } from '../store';
import Tile from '../interfaces/Tile';
import Powerup from './Powerup';
import incrementTurn from '../actions/incrementTurn';


describe('TileInfo', () => {

    // putting out here since don't want to create every tile needed for entire game on every test
    const tileBag = new Tilebag();

    function setTileInfoToRandomTile() {

        const tileInfo = new TileInfo();
        const tile: Tile = casual.random_element(tileBag.tiles);
        tileInfo.place(tile);

        return {
            tileInfo,
            tile
        };
    }


    describe('when created', () => {

        it('is not filled', () => {

            expect((new TileInfo().filled)).toBeFalsy();
        });

        it('has no tile', () => {

            expect((new TileInfo().tile)).toBeFalsy();
        });

        it('has no Player', () => {

            expect((new TileInfo().Player)).toBeFalsy();
        });

        it('is not worth any points', () => {

            expect((new TileInfo().calculateValue())).toBe(0);
        });

        it('cannot be dragged', () => {

            expect((new TileInfo()).canDrag).toBeFalsy();
        });
    });

    describe('when `#place`d', () => {

        test('filled = true', () => {

            const { tile, tileInfo } = setTileInfoToRandomTile();

            expect(tileInfo.filled).toBeTruthy();
        });

        test('recent = true', () => {

            const { tile, tileInfo } = setTileInfoToRandomTile();

            expect(tileInfo.recent).toBeTruthy();
        });

        test('.canDrag = true', () => {

            const { tile, tileInfo } = setTileInfoToRandomTile();

            expect(tileInfo.canDrag).toBeTruthy();
        });

        test('.Player is current Player', () => {

            const { tile, tileInfo } = setTileInfoToRandomTile();
            const storeState = (store.getState() as typeof defaultState);

            expect(tileInfo.Player).toEqual(storeState.Players.find(Player => Player.turn));
        });

        test('.tile is same as the one placed', () => {

            const { tile, tileInfo } = setTileInfoToRandomTile();

            expect(tileInfo.tile).toEqual(tile);
        });
    });

    describe('#calculateValue is correct for tile with', () => {

        test('no powerup', () => {

            const { tile, tileInfo } = setTileInfoToRandomTile();

            expect(tileInfo.calculateValue()).toBe(tile.points);
        });

        test('letter powerup', () => {

            const { tile, tileInfo } = setTileInfoToRandomTile();
            const powerup = new Powerup('letter', 2);

            tileInfo.powerup = powerup;

            expect(tileInfo.calculateValue()).toBe(tile.points * powerup.multiplyBy);
        });

        test('word powerup', () => {

            const { tile, tileInfo } = setTileInfoToRandomTile();
            const powerup = new Powerup('word', 2);

            tileInfo.powerup = powerup;

            expect(tileInfo.calculateValue()).toBe(tile.points);
        });

        test('no tile', () => {

            expect((new TileInfo()).calculateValue()).toBe(0);
        });
    });

    describe('when a turn has passed', () => {

        function setTileAndIncrementTurn() {

            const { tileInfo } = setTileInfoToRandomTile();

            const storeState = (store.getState() as typeof defaultState);
            store.dispatch(incrementTurn(storeState.turn));

            return tileInfo;
        }

        it('.canDrag = false', () => {

            const tileInfo = setTileAndIncrementTurn();

            expect(tileInfo.canDrag).toBeFalsy();
        });

        it('recent = false', () => {

            const tileInfo = setTileAndIncrementTurn();

            expect(tileInfo.recent).toBeFalsy();
        });
    });

    describe('#reset', () => {

        it('makes TileInfo like new', () => {

            const { tileInfo } = setTileInfoToRandomTile();
            tileInfo.reset();

            expect(tileInfo).toEqual(new TileInfo());
        });
    });
});