import Powerup from './Powerup';
import Tile from '../interfaces/Tile';
import Player from '../classes/Player';
import store, { defaultState } from '../store';

export default class TileInfo {

    filled: boolean;
    turnTileWasPlaced: number;
    powerup?: Powerup | undefined;
    _tile?: Tile;
    Player: Player;

    constructor() {
        this.reset();
    }

    set tile(tile: Tile | undefined) {
        this._tile = tile;
    }

    get tile(): Tile | undefined {

        return this._tile;
    }

    get canDrag() {
        return this.turnTileWasPlaced === (store.getState() as typeof defaultState).turn || this.Player.turn;
    }

    get recent() {
        return this.turnTileWasPlaced === (store.getState() as typeof defaultState).turn;
    }

    set recent(value: boolean) {
        return;
    }

    calculateValue() {

        const powerup = (this.powerup && this.powerup.target === 'letter') ? this.powerup.multiplyBy : 1;

        return this.tile ? this.tile.points * powerup : 0;
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
        this.tile = tile;
        this.Player = storeState.Players.find(player => player.turn)!;
    }
}