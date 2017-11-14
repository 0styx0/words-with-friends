import Powerup from './Powerup';
import Game from '../classes/Game';

export default class TileInfo {

    filled: boolean;
    turnTileWasPlaced: number;
    recent: boolean;
    powerup?: Powerup | undefined;
    points: number;

    constructor() {
        this.reset();
    }

    calculateValue() {

        const powerup = (this.powerup && this.powerup.target === 'letter') ? this.powerup.multiplyBy : 1;

        return this.points * powerup;
    }

    reset() {

        this.filled = false;
        this.turnTileWasPlaced = 0;
        this.recent = false;
        this.powerup = undefined;
        this.points = 0;
    }
    
    place(points: number) {
        this.filled = true;
        this.turnTileWasPlaced = Game.turn;
        this.recent = true;
        this.points = points;
    }
}