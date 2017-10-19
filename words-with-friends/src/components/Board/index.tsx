import * as React from 'react';
import './index.css';
import TileHolder from '../TileHolder/TileHolder';
import tilebag from '../../services/tilebag';

export default function Board() {

    tilebag.init(); // move to somewhere else once get game mechanic workings

    // const board = [];

    return (
        <div className="wrapper">
            {new Array(225).fill(null).map((elt, i) => <TileHolder key={i} />)}
        </div>
    );
}
