import * as React from 'react';
import './index.css';
import TileType from '../../interfaces/Tile';
import TileContainer from '../Tile/Tile';

interface Props {
    tile?: TileType;
}

export default function TileHolder(props: Props) {

    return (
        props.tile ? <TileContainer letter={props.tile.letter} points={props.tile.points} /> : <span />
    );
}
