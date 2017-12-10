import incrementTurn from './incrementTurn';
import initializeBoard from './initializeBoard';
import initializePlayers from './initializePlayers';
import removeTileFromHand from './removeTileFromHand';

export default {
    incrementTurn,
    changePlayer: incrementTurn,
    initializeBoard,
    initializePlayers,
    removeTileFromHand
};
