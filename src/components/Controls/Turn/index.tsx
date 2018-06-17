import * as React from 'react';

interface Props {
   turn: Function;
   number: number;
}

export default function Turn(props: Props) {

    return (
        <>
            <span className="white">Current Turn: {props.number}</span>
            <button id="playButton" onClick={() => props.turn()} type="button">Play</button>
        </>
   );
}
