import * as casual from 'casual';

import incrementTurn from '../actions/incrementTurn';
import Tile from '../interfaces/Tile';
import store, { defaultState, getState } from '../store';
import Powerup from './Powerup';
import Tilebag from './Tilebag';
import TileInfo from './TileInfo';


describe('TileInfo', () => {

    // putting out here since don't want to create every tile needed for entire game on every test
    const tileBag = new Tilebag();

    function setTileInfoToRandomTile(turn: number = casual.integer()) {

        const tileInfo = new TileInfo();
        const tile: Tile = casual.random_element(tileBag.tiles);
        tileInfo.place(tile, getState().Players[0], turn);

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

            const currentTurn = getState().turn;

            expect((new TileInfo()).canDrag(currentTurn)).toBeFalsy();
        });
    });

    describe('when `#place`d', () => {

        test('filled = true', () => {

            const { tileInfo } = setTileInfoToRandomTile();

            expect(tileInfo.filled).toBeTruthy();
        });

        test('recent = true', () => {

            const { tileInfo } = setTileInfoToRandomTile();

            expect(tileInfo.recent).toBeTruthy();
        });

        test('.canDrag = true', () => {

            const currentTurn = casual.integer();

            const { tileInfo } = setTileInfoToRandomTile(currentTurn);

            expect(tileInfo.canDrag(currentTurn)).toBeTruthy();
        });

        test('.Player is current Player', () => {

            const { tileInfo } = setTileInfoToRandomTile();
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
            store.dispatch(incrementTurn(storeState.turn, storeState.Tilebag));

            return tileInfo;
        }

        it('.canDrag = false', () => {

            const tileInfo = setTileAndIncrementTurn();

            const currentTurn = getState().turn;

            expect(tileInfo.canDrag(currentTurn)).toBeFalsy();
        });

        it('recent = false', () => {

            const turn = getState().turn;
            const tileInfo = setTileAndIncrementTurn();

            expect(tileInfo.recent(turn)).toBeFalsy();
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