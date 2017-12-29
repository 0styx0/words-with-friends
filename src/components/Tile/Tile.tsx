import * as React from 'react';
import { DragEvent } from 'react';
import TileType from '../../interfaces/Tile';
import Tile from './';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';


function mapStateToProps(state: typeof defaultState, props: Props) {

    return {
        coordinates: props.coordinates,
        tile: props.tile,
        Players: state.Players,
        board: state.board,
        turn: state.turn
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}


type Props = typeof actionCreators & typeof defaultState & {
    tile: TileType;
    removeTile: Function;
    coordinates: number[];
};


class TileContainer extends React.Component<Readonly<Props>, {}> {

    constructor(props: Readonly<Props>) {
        super(props);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    /**
     * Sets event drop data to stringified `this.props.tile`
     */
    onDragStart(e: DragEvent<HTMLDivElement>) {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('tile', JSON.stringify(this.props.tile));
    }

    /**
     * If tile was dropped somewhere else (checked using `dropEffect`), removes tile from this TileContainer
     *  (so the tile doesn't get duplicated, just moved)
     */
    onDragEnd(e: DragEvent<HTMLDivElement>) {

        const tileWasMoved = e.dataTransfer.dropEffect !== 'none';

        if (tileWasMoved) {
            this.props.removeTile();
        }
    }

    /**
     * @return true if tile is already on board and was placed on current turn,
     *  or tile is in current player's hand. Else false
     */
    canDrag() {

        const data = this.props.board.get(this.props.coordinates);

        const tileIsAlreadyOnBoard = data && !!data!.tile;

        const tileInCurrentPlayersHand =
            !tileIsAlreadyOnBoard && this.props.Players[this.props.tile.playerIndex!].turn;
        const draggableTileOnBoard = tileIsAlreadyOnBoard && data!.canDrag;

        return !!(tileInCurrentPlayersHand || draggableTileOnBoard);
    }

    render() {

        const canDrag = this.canDrag();

        return (
            <div
                className="tileContainer"
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                draggable={canDrag}
            >
                <Tile
                    tile={this.props.tile}
                    coordinates={this.props.coordinates}
                    canDrag={canDrag}
                />
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(TileContainer as any);
