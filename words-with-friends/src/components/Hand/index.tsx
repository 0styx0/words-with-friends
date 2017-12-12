import * as React from 'react';
import TileHolder from '../TileHolder/TileHolder';
import './index.css';
import Tile from '../../interfaces/Tile';

interface Props {
    className?: string;
    tiles: Tile[];
}

/**
 * A player's hand
 */
export default function Hand(props: Props) {

    const handHolders = props.tiles.map((tile, i) => (
        <TileHolder tile={tile} key={i + tile.letter} {...[] as any}/>
    ));

    return <div className="tileHand">{handHolders}</div>;
}