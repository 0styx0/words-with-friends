import * as React from 'react';
import HandContainer from '../Hand/Hand';
import BoardContainer from '../Board/Board';
import ControlsContainer from '../Controls/Controls';
import './index.css';

interface Props {
    hands: HandContainer[];
    turn: Function;
}

export default function Game(props: Props) {

    return (
        <div id="gameContainer">
            {props.hands[0]}
            <BoardContainer />
            {props.hands[1]}
            <ControlsContainer turn={props.turn} />
        </div>
    );
}