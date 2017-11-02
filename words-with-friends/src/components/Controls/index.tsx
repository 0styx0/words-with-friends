import * as React from 'react';
import './index.css';

interface Props {
    play: Function;
}

export default function Controls(props: Props) {


    return <button onClick={() => props.play()} id="controls" type="button">Play</button>;
}


