import * as React from 'react';

import { defaultState } from '../../../store';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../../actions';
import Board from '../../../classes/Board';
import ReturnTiles from './';

type Props = typeof actionCreators & typeof defaultState;

function mapStateToProps(state: typeof defaultState, props: Props) {
    return {
        Players: state.Players,
        board: state.board,
        turn: state.turn
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}

export class ReturnTilesContainer extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        this.returnTiles = this.returnTiles.bind(this);
    }

    returnTiles(event: React.MouseEvent<HTMLButtonElement>) {

        const recentlyPlacedCoordinates = Board.getTilesPlaced(this.props.board, this.props.turn);

        recentlyPlacedCoordinates.forEach((coordinate) => {

            const tile = this.props.board.get(coordinate)!.tile!;

            this.props.putTileInHand(this.props.Players, tile);
            this.props.removeTileFromBoard(coordinate);
        });
    }

    render() {
        return <ReturnTiles returnTiles={this.returnTiles} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReturnTilesContainer as any);
