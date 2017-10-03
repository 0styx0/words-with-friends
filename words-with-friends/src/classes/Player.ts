import Tile from '../interfaces/Tile';
import tileBag from '../services/tilebag';

export class Player {

    name = '';
    turn = false;
    score = 0;
    hand: Tile[];

    /**
     * Fills player's hand with up to 7 tiles
     */
    fillHand() {

        while (this.hand.length < 7 && tileBag.tiles.length > 0) {
            this.hand.push(tileBag.getRandomTile());
        }
    }
}
