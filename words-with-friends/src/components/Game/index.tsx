import * as React from 'react';
import HandContainer from '../Hand/Hand';
import BoardContainer from '../Board/Board';
import ControlsContainer from '../Controls/Controls';
import './index.css';

interface Props {
    turn: Function;
}

export default function Game(props: Props) {

    return (
        <div id="gameContainer">
            {<HandContainer
                key={0}
                playerIndex={0}
            />}
            <BoardContainer />
            {<HandContainer
                key={1}
                playerIndex={1}
            />}
            <ControlsContainer turn={props.turn} />
        </div>
    );
}