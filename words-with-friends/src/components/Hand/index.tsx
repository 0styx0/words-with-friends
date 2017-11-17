import * as React from 'react';
import TileHolder from '../TileHolder/TileHolder';
import './index.css';
import Tile from '../../interfaces/Tile';

interface Props {
    className?: string;
    tiles: Tile[];
    canDrag: boolean;
    removeTile: Function;
}

/**
 * A player's hand
 */
export default function Hand(props: Props) {

    const handHolders = props.tiles.map((tile, i) => (
        <TileHolder removeTile={props.removeTile} canDrag={props.canDrag} tile={tile} key={i} />
    ));

    const className = 'tileHand ' + props.className;

    return <div className={className}>{handHolders}</div>;
}