import * as React from 'react';
import TileHolder from './';
import TileType from '../../interfaces/Tile';
import Game from '../Game/Game';
import { DragEvent } from 'react';

interface Props {
    tile?: TileType;
    connectDropTarget?: Function;
    isOver?: Function;
    coordinates?: string;
    removeTile?: Function;
}

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

            const tileInfo = Game.board.get(this.props.coordinates)!;
            tileInfo.place(tile);
            Game.board.set(this.props.coordinates, tileInfo);
        }

    }

    /**
     * Removes tile from TileHolder (@see Tile.tsx#source.endDrag)
     */
    removeTile() {

        this.props.removeTile && this.props.removeTile(this.state.tile);

        this.setState({
            tile: undefined
        });

        if (this.props.coordinates) {

            const tileInfo = Game.board.get(this.props.coordinates)!;
            tileInfo.reset();

            Game.board.set(this.props.coordinates, tileInfo);
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

export default TileHolderContainer; // DropTarget('tile', tileTarget, collect)(TileHolderContainer);
