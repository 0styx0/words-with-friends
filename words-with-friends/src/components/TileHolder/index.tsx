import * as React from 'react';
import './index.css';
import TileType from '../../interfaces/Tile';
import TileContainer from '../Tile/Tile';
import Game from '../../classes/Game';

interface Props {
    tile?: TileType;
    removeTile: Function;
    canDrag: boolean;
    coordinates: string;
}

export default function TileHolder(props: Props) {

    let powerupName = '';

    if (Game.board.get(props.coordinates) && Game.board.get(props.coordinates)!.powerup) {
        powerupName = Game.board.get(props.coordinates)!.powerup!.name;
    }

    return (
        props.tile ? (
            <TileContainer
              removeTile={props.removeTile}
              letter={props.tile.letter}
              points={props.tile.points}
              canDrag={props.canDrag}
              coordinates={props.coordinates}
            />
        ) : <span>{powerupName}</span>
    );
}
