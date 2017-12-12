import HandContainer from '../components/Hand/Hand';
import Tile from '../interfaces/Tile';
import store, { defaultState } from '../store';

export default class Player {

    name = '';
    turn = false;
    score = 0;
    hand: typeof HandContainer;
    private _tiles: Tile[] = [];
    private _playerIndex: number;

    constructor(turn: boolean, playerIndex: number) {
        this.turn = turn;
        this._playerIndex = playerIndex;
    }

    get tiles() {
        return this._tiles;
    }

    generateHand() {

        while (this._tiles.length < 7 && (store.getState() as typeof defaultState).Tilebag.tiles.length > 0) {

            const tile = (store.getState() as typeof defaultState).Tilebag.getRandomTile(this._playerIndex);
            tile.playerIndex = this._playerIndex;
            this._tiles.push(tile);
        }
    }

    removeTile(tile: Tile) {

        const positionOfTile = this._tiles.indexOf(tile);
        this._tiles.splice(positionOfTile, 1);
    }

    addTile(tile: Tile) {
        tile.playerIndex = this._playerIndex;
        this._tiles.push(tile);
    }
}
