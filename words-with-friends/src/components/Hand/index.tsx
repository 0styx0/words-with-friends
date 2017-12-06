import * as React from 'react';
import TileHolder from '../TileHolder/TileHolder';
import './index.css';
import Tile from '../../interfaces/Tile';

interface Props {
    className?: string;
    tiles: Tile[];
    removeTile: Function;
}

/**
 * A player's hand
 */
export default function Hand(props: Props) {

    console.log('hand', props.tiles.reduce((acc = [], tile) => acc.concat([tile.playerIndex!]), [] as any));

    const handHolders = props.tiles.map((tile, i) => (
        <TileHolder removeTile={props.removeTile} tile={tile} key={i} />
    ));

    const className = 'tileHand ' + props.className;

    return <div className={className}>{handHolders}</div>;
}