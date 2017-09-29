import * as React from 'react';
import './index.css';
// import Tile from '../Tile';

export default function Board() {

    return (
        <div className="wrapper">
            {new Array(225).fill(null).map((elt, i) => <div />)}
        </div>
    );
}
