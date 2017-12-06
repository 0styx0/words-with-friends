import * as React from 'react';
import Game from '../Game/Game';
import { DragEvent } from 'react';
import TileType from '../../interfaces/Tile';
import Tile from './';

interface Props {
    tile: TileType;
    removeTile: Function;
    coordinates: string;
}


export default class TileContainer extends React.Component<Props, {}> {

    constructor() {
        super();

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragStart(e: DragEvent<HTMLDivElement>) {
        // console.log(this.canDrag());
        if (this.canDrag()) {
            e.dataTransfer.setData('tile', JSON.stringify(this.props.tile));
            e.dataTransfer.dropEffect = 'move';
        }
    }

    onDragEnd(e: DragEvent<HTMLDivElement>) {

        const tileWasMoved = e.dataTransfer.dropEffect !== 'none';

        if (tileWasMoved) {
            this.props.removeTile();
        }
    }

  canDrag() {

      const data = Game.board.get(this.props.coordinates);
      const tileIsAlreadyOnBoard = !!data;

      const tileInCurrentPlayersHand = !tileIsAlreadyOnBoard && Game.Players[this.props.tile.playerIndex!].turn;
      const draggableTileOnBoard = tileIsAlreadyOnBoard && data!.canDrag;
    //   console.log(tileIsAlreadyOnBoard , Game.Players[this.props.tile.playerIndex!].turn, this.props.tile.playerIndex);
      return tileInCurrentPlayersHand || draggableTileOnBoard;
  }

    render() {

        // console.log(this.props.tile && this.props.tile.playerIndex);
        // console.log(this.canDrag());
        return (
            <div
                className="tileContainer"
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                draggable={true || this.canDrag()}
                key={+this.canDrag()}
            >
                <Tile
                    key={+this.canDrag()}
                    tile={this.props.tile}
                    coordinates={this.props.coordinates}
                    canDrag={this.canDrag()}
                />
            </div>
        );
    }

}