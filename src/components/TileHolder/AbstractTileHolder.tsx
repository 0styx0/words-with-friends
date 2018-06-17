import * as React from 'react';
import TileType from '../../interfaces/Tile';
import { DragEvent } from 'react';
import Tile from '../../interfaces/Tile';

interface PropBase {
    tile?: Tile; // to get rid of error when referring to `this.props.tile`
}

abstract class AbstractTileHolder<Props> extends React.Component<Props & PropBase, {}> {

    constructor(props: Props & PropBase) {
        super(props);

        this.removeTile = this.removeTile.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
    }

    abstract putTile(tile: TileType): void;

    abstract removeTile(): void;

    onDrop(e: DragEvent<HTMLDivElement>) {

        e.preventDefault();
        const tile = JSON.parse(e.dataTransfer.getData('tile'));
        this.putTile(tile);
    }

    canDrop() {
        return !this.props.tile;
    }

    onDragEnter(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    onDragOver(e: DragEvent<HTMLDivElement>) {

        e.preventDefault();

        if (!this.canDrop()) {
            e.dataTransfer.dropEffect = 'none';
        }
    }
}

export default AbstractTileHolder;
