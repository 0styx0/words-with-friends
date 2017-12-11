import * as React from 'react';
import './index.css';
import TileType from '../../interfaces/Tile';
import TileContainer from '../Tile/Tile';
import Powerup from '../../classes/Powerup';

interface Props {
    tile?: TileType;
    removeTile: Function;
    coordinates: string;
    powerup?: Powerup;
}

export default function TileHolder(props: Props) {

    return (
        props.tile ? (
            <TileContainer
              removeTile={props.removeTile}
              tile={props.tile}
              coordinates={props.coordinates}
              {...[] as any}
            />
        ) : <span>{props.powerup ? props.powerup.name : ''}</span>
    );
}
