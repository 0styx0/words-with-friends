import * as React from 'react';
import './index.css';

interface Props {
    letter: string;
    points: number;
}

export default function Tile(props: Props) {

    return (
        <div className="tile">
            <span className="points">{props.points}</span>
            <span className="letter">{props.letter}</span>
        </div>
    );
}
