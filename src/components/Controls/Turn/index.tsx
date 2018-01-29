import * as React from 'react';

interface Props {
    turn: Function;
}

export default function Turn(props: Props) {

    return <button onClick={() => props.turn()} type="button">Play</button>;
}