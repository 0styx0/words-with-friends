import * as React from 'react';
import './index.css';
import TileType from '../../interfaces/Tile';
import TileContainer from '../Tile/Tile';

interface Props {
    tile?: TileType;
    removeTile: Function;
}

export default function TileHolder(props: Props) {

    return (
        props.tile ? <TileContainer removeTile={props.removeTile} letter={props.tile.letter} points={props.tile.points} /> : <span />
    );
}
