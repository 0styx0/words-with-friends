import * as React from 'react';
import './index.css';
import TileType from '../../interfaces/Tile';
import Tile from '../Tile';

interface Props {
    tile?: TileType;
}

export default function TileHolder(props: Props) {

    return (
        <div className="tileHolder">
            {props.tile ? <Tile letter={props.tile.letter} points={props.tile.points} /> : <span />}
        </div>
    );
}
