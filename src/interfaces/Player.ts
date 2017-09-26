import Tile from './Tile';

export default interface Player {
    name: string,
    turn: boolean,
    score: number,
    hand: Tile[]
}