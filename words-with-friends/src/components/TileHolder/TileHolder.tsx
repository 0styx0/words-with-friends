import * as React from 'react';
import TileHolder from './';
import TileType from '../../interfaces/Tile';
import { DragEvent } from 'react';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';
import Player from '../../classes/Player';


function mapStateToProps(state: typeof defaultState, props: Props) {
    return {
        coordinates: props.coordinates,
        tile: props.tile,
        currentPlayer: state.Players.find(player => player.turn)
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}


type Props = typeof actionCreators & typeof defaultState & {
    tile?: TileType;
    coordinates?: string;
    currentPlayer: Player;
};

interface State {
    tile?: TileType;
}

export class TileHolderContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super();
        props.tile && console.info(props.tile!.playerIndex);
        this.removeTile = this.removeTile.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.state = {};

        if (props.tile) { // there will always be props.tile, but need to satisfy typescript

            this.state = {
                tile: props.tile
            };
        }

    }

    /**
     * Puts tile down (@see tileTarget.drop)
     */
    putTile(tile: TileType) {

        this.setState({
           tile: tile
        });

        if (this.props.coordinates) {

            // const tileInfo = Game.board.get(this.props.coordinates)!;
            // tileInfo.place(tile);
            // Game.board.set(this.props.coordinates, tileInfo);
        }

    }

    /**
     * Removes tile from TileHolder (@see Tile.tsx#source.endDrag)
     */
    removeTile() {

        this.props.removeTileFromHand && this.state.tile &&
            this.props.removeTileFromHand(this.props.currentPlayer, this.state.tile!);

        this.setState({
            tile: undefined
        });

        if (this.props.coordinates) {

            // const tileInfo = Game.board.get(this.props.coordinates)!;
            // tileInfo.reset();

            // Game.board.set(this.props.coordinates, tileInfo);
        }
    }

    onDrop(e: DragEvent<HTMLDivElement>) {

        e.preventDefault();

        const tile = JSON.parse(e.dataTransfer.getData('tile'));
        this.putTile(tile);
    }

    canDrop() {
        return !this.state.tile;
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
                    coordinates={this.props!.coordinates!}
                    {...this.state}
                    removeTile={this.removeTile}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TileHolderContainer as any);
