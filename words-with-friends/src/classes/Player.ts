// import Tile from '../interfaces/Tile';
import Hand from '../components/Hand/Hand';
// import tileBag from '../services/tilebag';

export default class Player {

    name = '';
    turn = false;
    score = 0;
    hand: Hand;
}
