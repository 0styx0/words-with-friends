import incrementTurn from './incrementTurn';
import initializeBoard from './initializeBoard';
import initializePlayers from './initializePlayers';
import putTileOnBoard from './putTileOnBoard';
import removeTileFromBoard from './removeTileFromBoard';
import putTileInHand from './putTileInHand';
import removeTileFromHand from './removeTileFromHand';

export default {
    incrementTurn,
    changePlayer: incrementTurn,
    initializeBoard,
    putTileOnBoard,
    putTileInHand,
    removeTileFromHand,
    removeTileFromBoard,
    initializePlayers,

};
