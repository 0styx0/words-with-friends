import * as React from 'react';
import './index.css';
import TileHolder from '../TileHolder';

export default function Board() {

    return (
        <div className="wrapper">
            {new Array(225).fill(null).map((elt, i) => <TileHolder key={i} />)}
        </div>
    );
}
