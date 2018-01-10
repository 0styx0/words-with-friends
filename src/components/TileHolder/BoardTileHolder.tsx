import * as React from 'react';
import TileHolder from './';
import TileType from '../../interfaces/Tile';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';
import Player from '../../classes/Player';
import AbstractTileHolder from './AbstractTileHolder';
import Board from '../../classes/Board';


function mapStateToProps(state: typeof defaultState, props: Props) {

    return {
        coordinates: props.coordinates,
        tile: state.board.get(props.coordinates) ? state.board.get(props.coordinates)!.tile : undefined,
        currentPlayer: state.Players.find(player => player.turn),
        board: state.board,
        turn: state.turn
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}


type Props = typeof actionCreators & typeof defaultState & {
    tile?: TileType;
    coordinates: number[];
    currentPlayer: Player;
    board: Board,
    turn: number
};

export class BoardTileHolderContainer extends AbstractTileHolder<Props> {

    /**
     * Puts tile down (@see tileTarget.drop)
     */
    putTile(tile: TileType) {

        this.props.putTileOnBoard(tile, this.props.coordinates, this.props.Players, this.props.turn);
    }

    /**
     * Removes tile from TileHolder (@see Tile.tsx#source.endDrag)
     */
    removeTile() {

        this.props.removeTileFromBoard(this.props.coordinates);
    }

    render() {

        return (
            <div
              className="tileHolder"
              onDrop={this.onDrop}
              onDragOver={this.onDragOver}
            >
                <TileHolder
                    coordinates={this.props.coordinates!}
                    tile={this.props.tile}
                    powerup={this.props.board.get(this.props.coordinates) &&
                        this.props.board.get(this.props.coordinates)!.powerup}
                    removeTile={this.removeTile}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardTileHolderContainer as any);
