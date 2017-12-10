import * as React from 'react';
import './index.css';
import TileHolder from '../TileHolder/TileHolder';

interface Props {
    board: typeof TileHolder[];
}

export default function Board(props: Props) {

    return (
        <div className="wrapper">
            {props.board}
        </div>
    );
}
