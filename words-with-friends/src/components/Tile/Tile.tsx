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
    coordinates: string;
};


class TileContainer extends React.Component<Props, {}> {

    constructor() {
        super();

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragStart(e: DragEvent<HTMLDivElement>) {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('tile', JSON.stringify(this.props.tile));
    }

    onDragEnd(e: DragEvent<HTMLDivElement>) {

        const tileWasMoved = e.dataTransfer.dropEffect !== 'none';

        if (tileWasMoved) {
            this.props.removeTile();
        }
    }

  canDrag() {

      const data = this.props.board.get(this.props.coordinates);
      const tileIsAlreadyOnBoard = !!data;

      const tileInCurrentPlayersHand = !tileIsAlreadyOnBoard  && this.props.Players[this.props.tile.playerIndex!].turn;
      const draggableTileOnBoard = tileIsAlreadyOnBoard && data!.canDrag;

      return tileInCurrentPlayersHand || draggableTileOnBoard;
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
