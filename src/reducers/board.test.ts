import board from './board';
import BoardClass from '../classes/Board';
import types from '../actions/types';
import { getState } from '../store';
import * as casual from 'casual';
import TileInfo from '../classes/TileInfo';

describe('board', () => {

    describe('INIT_BOARD', () => {

        it('returns new Board', () => {

            const newBoard = board(undefined, {
                type: types.INIT_BOARD,
                board: new BoardClass()
            });

            expect(newBoard).toBeInstanceOf(BoardClass);
            expect(newBoard.size).toBe((+process.env.REACT_APP_BOARD_DIMENSIONS!) ** 2);
        });
    });

    describe('PLACE_TILE_ON_BOARD', () => {

        it('puts correct tile on board at proper coordinates', () => {

            const tile = getState().Tilebag.getRandomTile(0);
            const coordinates = casual.array_of_integers(2);

            const boardWithTile = board(new BoardClass(), {
                type: types.PLACE_TILE_ON_BOARD,
                tile,
                currentPlayer: casual.random_element(getState().Players),
                currentTurn: casual.integer(),
                coordinates
            });

            expect(boardWithTile.get(coordinates)!.tile).toEqual(tile);
        });
    });

    describe('REMOVE_TILE_FROM_BOARD', () => {

        it('removes tile as coordinates given', () => {

            const coordinates = casual.array_of_integers(2);
            const initialBoard = new BoardClass();
            const tile = getState().Tilebag.getRandomTile(0);
            const tileInfo = new TileInfo();
            tileInfo.place(tile, casual.random_element(getState().Players), getState().turn);
            initialBoard.set(coordinates, tileInfo);

            const boardWithoutTile = board(initialBoard, {
                type: types.REMOVE_TILE_FROM_BOARD,
                coordinates
            });

            expect(boardWithoutTile.get(coordinates)).toEqual(new TileInfo());
        });
    });
});