import * as React from 'react';
import './index.css';

import BoardTileHolder from '../TileHolder/TileHolder';

export default function Board() {

    let board: typeof BoardTileHolder[] = [];

    for (let i = 0; i < +process.env.REACT_APP_BOARD_DIMENSIONS!; i++) {

        for (let j = 0; j < +process.env.REACT_APP_BOARD_DIMENSIONS!; j++) {

            board.push(
                <BoardTileHolder
                    coordinates={[j, i]}
                    key={`${j}, ${i}`}
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
