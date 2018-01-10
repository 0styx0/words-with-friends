import * as React from 'react';
import './index.css';
import HandTileHolder from '../TileHolder/HandTileHolder';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';
import Tile from '../../interfaces/Tile';
import Board from '../../classes/Board';


function mapStateToProps(state: typeof defaultState, props: {playerIndex: number}) {

    return {
        tiles: state.Players[props.playerIndex].tiles,
        board: state.board,
        tileNumber: state.Players[props.playerIndex].tiles.length, // force refresh after tile is removed
        turn: state.turn // force refresh after turn
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}

type Props = typeof actionCreators & typeof defaultState & {
    tiles: Tile[],
    board: Board,
    tileNumber: number,
    turn: number
};

function HandContainer(props: Readonly<Props>) {

    const tiles = props.tiles;

    const handHolders = tiles.map((tile, i) => (
        <HandTileHolder tile={tile} key={i + tile.letter} {...[] as any} />
    ));

    const lengthOfScrabbleHand = 7;

    while (handHolders.length < lengthOfScrabbleHand) {
        handHolders.push(<HandTileHolder key={handHolders.length} {...[] as any} />);
    }

    return <div className="tileHand">{handHolders}</div>;
}

export default connect(mapStateToProps, mapDispatchToProps)(HandContainer as any);
