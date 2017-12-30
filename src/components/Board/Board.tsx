import * as React from 'react';
import './index.css';

import BoardTileHolder from '../TileHolder/BoardTileHolder';

export default function Board() {

    let board: typeof BoardTileHolder[] = [];

    for (let y = 0; y < +process.env.REACT_APP_BOARD_DIMENSIONS!; y++) {

        for (let x = 0; x < +process.env.REACT_APP_BOARD_DIMENSIONS!; x++) {

            board.push(
                <BoardTileHolder
                    coordinates={[x, y]}
                    key={`${x}, ${y}`}
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
