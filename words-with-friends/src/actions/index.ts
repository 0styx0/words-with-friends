import incrementTurn from './incrementTurn';
import initializeBoard from './initializeBoard';
import initializePlayers from './initializePlayers';
import putTileOnBoard from './putTileOnBoard';
import removeTileFromBoard from './removeTileFromBoard';

export default {
    incrementTurn,
    changePlayer: incrementTurn,
    initializeBoard,
    putTileOnBoard,
    removeTileFromBoard,
    initializePlayers
};
