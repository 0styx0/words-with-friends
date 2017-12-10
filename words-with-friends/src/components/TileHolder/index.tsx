import * as React from 'react';
import './index.css';
import TileType from '../../interfaces/Tile';
import TileContainer from '../Tile/Tile';
// import Game from '../Game/Game';

interface Props {
    tile?: TileType;
    removeTile: Function;
    coordinates: string;
}

export default function TileHolder(props: Props) {

    let powerupName = '';

    // const data = Game.board.get(props.coordinates);

    // if (data && Game.board.get(props.coordinates)!.powerup) {
    //     powerupName = Game.board.get(props.coordinates)!.powerup!.name;
    // }

    return (
        props.tile ? (
            <TileContainer
              removeTile={props.removeTile}
              tile={props.tile}
              coordinates={props.coordinates}
            />
        ) : <span>{powerupName}</span>
    );
}
