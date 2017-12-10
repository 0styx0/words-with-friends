import HandContainer from '../components/Hand/Hand';
import Tile from '../interfaces/Tile';
import store, { defaultState } from '../store';

export default class Player {

    name = '';
    turn = false;
    score = 0;
    hand: typeof HandContainer;
    tiles: Tile[] = [];

    constructor(name: string) {
        this.name = name;
    }

    generateHand() {

        while (this.tiles.length < 7 && (store.getState() as typeof defaultState).Tilebag.tiles.length > 0) {

            const tile = (store.getState() as typeof defaultState).Tilebag.getRandomTile();
            this.tiles.push(tile);
        }
    }

    removeTile(tile: Tile) {

        const positionOfTile = this.tiles.indexOf(tile);
        this.tiles.splice(positionOfTile - 1, 1);
    }

    addTile(tile: Tile) {
        this.tiles.push(tile);
    }
}
