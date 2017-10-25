import * as React from 'react';
import './index.css';
import tilebag from '../../services/tilebag';
import TileHolder from '../TileHolder/TileHolder';

interface Props {
    tiles: TileHolder[];
}

export default function Board(props: Props) {

    tilebag.init(); // move to somewhere else once get game mechanic workings

    let board: TileHolder[] = [];

    props.tiles.forEach(column => {

        board = board.concat(column);
    });

    return (
        <div className="wrapper">
            {board}
        </div>
    );
}
