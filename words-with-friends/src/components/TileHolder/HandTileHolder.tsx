import * as React from 'react';
import TileHolder from './';
import TileType from '../../interfaces/Tile';
import { DragEvent } from 'react';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';
import Player from '../../classes/Player';
import TileInfo from '../../classes/TileInfo';


function mapStateToProps(state: typeof defaultState, props: Props) {
    return {
        tile: props.tile,
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
    currentPlayer: Player;
    board: Map<string, TileInfo>;
    turn: number;
};


class HandTileHolderContainer extends React.Component<Props, {}> {

    constructor(props: Props) {
        super();

        this.removeTile = this.removeTile.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
    }

    /**
     * Puts tile down (@see tileTarget.drop)
     */
    putTile(tile: TileType) {

        this.props.putTileInHand(this.props.currentPlayer, tile!);
    }

    /**
     * Removes tile from TileHolder (@see Tile.tsx#source.endDrag)
     */
    removeTile() {
        this.props.removeTileFromHand(this.props.currentPlayer, this.props.tile!);
    }

    onDrop(e: DragEvent<HTMLDivElement>) {

        e.preventDefault();
        const tile = JSON.parse(e.dataTransfer.getData('tile'));
        this.putTile(tile);
    }

    canDrop() {
        return !this.props.tile;
    }

    onDragOver(e: DragEvent<HTMLDivElement>) {

        e.preventDefault();

        if (!this.canDrop()) {
            e.dataTransfer.dropEffect = 'none';
        }
    }

    render() {

        return (
            <div
              className="tileHolder"
              onDrop={this.onDrop}
              onDragOver={this.onDragOver}
            >
                <TileHolder
                    tile={this.props.tile}
                    removeTile={this.removeTile}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HandTileHolderContainer as any);
