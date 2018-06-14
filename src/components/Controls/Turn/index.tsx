import * as React from 'react';

interface Props {
   turn: Function;
   number: number;
   disabled: boolean;
}

export default function Turn(props: Props) {

    return (
        <>
            <span className="white">Current Turn: {props.number}</span>
            <button disabled={props.disabled} onClick={() => props.turn()} type="button">Play</button>
        </>
   );
}
