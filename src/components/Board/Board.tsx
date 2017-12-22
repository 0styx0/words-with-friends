import * as React from 'react';
import './index.css';

import BoardTileHolder from '../TileHolder/TileHolder';

export default function Board() {

    let board: typeof BoardTileHolder[] = [];

    for (let i = 0; i < +process.env.BOARD_DIMENSIONS!; i++) {

        for (let j = 0; j < +process.env.BOARD_DIMENSIONS!; j++) {

            board.push(
                <BoardTileHolder
                    coordinates={`${i}, ${j}`}
                    key={`${i}, ${j}`}
                    {...[] as any}
                /> as {} as typeof BoardTileHolder
            );
        }
    }

    return (
        <div className="wrapper">
            {board}
        </div>
    );
}
