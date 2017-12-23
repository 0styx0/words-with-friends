import Powerup from './Powerup';
import Tile from '../interfaces/Tile';
import Player from '../classes/Player';
import store, { defaultState } from '../store';

export default class TileInfo {

    filled: boolean;
    powerup?: Powerup | undefined;
    Player: Player;
    private _tile?: Tile;
    private turnTileWasPlaced: number;

    constructor() {
        this.reset();
    }

    get tile() {
        return this._tile;
    }

    get canDrag() {
        return this.turnTileWasPlaced === (store.getState() as typeof defaultState).turn;
    }

    get recent() {
        return this.turnTileWasPlaced === (store.getState() as typeof defaultState).turn;
    }

    set recent(value: boolean) {
        return;
    }

    calculateValue() {

        const powerup = (this.powerup && this.powerup.target === 'letter') ? this.powerup.multiplyBy : 1;

        return this._tile ? this._tile.points * powerup : 0;
    }

    reset() {

        this.filled = false;
        this.turnTileWasPlaced = 0;
        this.recent = false;
        this._tile = undefined;
    }

    place(tile: Tile) {

        const storeState = (store.getState() as typeof defaultState);

        this.filled = true;
        this.turnTileWasPlaced = storeState.turn;
        this.recent = true;
        this._tile = tile;
        this.Player = storeState.Players.find(player => player.turn)!;
    }
}