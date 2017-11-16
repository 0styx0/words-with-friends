import * as React from 'react';
import './index.css';
import TileHolder from '../TileHolder/TileHolder';

interface Props {
    tiles: typeof TileHolder[];
}

export default function Board(props: Props) {

    let board: typeof TileHolder[] = [];

    props.tiles.forEach(column => {

        board = board.concat(column);
    });

    return (
        <div className="wrapper">
            {board}
        </div>
    );
}
