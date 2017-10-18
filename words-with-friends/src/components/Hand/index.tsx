import * as React from 'react';
import TileHolder from '../TileHolder';
import './index.css';
import tilebag from '../../services/tilebag';

interface Props {
    className?: string;
}

/**
 * A player's hand
 */
export default function Hand(props: Props) {

    const handHolders = [];

    for (let i = 0; i < 7; i++) {
        handHolders.push(<TileHolder tile={tilebag.getRandomTile()} key={i} />);
    }

    const className = 'tileHand ' + props.className;

    return <div className={className}>{handHolders}</div>;
}