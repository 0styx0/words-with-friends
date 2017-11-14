import Powerup from './Powerup';

export default interface TileInfo {
    filled: boolean;
    turnTileWasPlaced: number;
    recent: boolean;
    powerup?: Powerup | undefined;
}