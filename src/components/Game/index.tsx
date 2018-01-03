import * as React from 'react';
import HandContainer from '../Hand/Hand';
import BoardContainer from '../Board/Board';
import ControlsContainer from '../Controls/Controls';
import './index.css';

export default function Game() {

    return (
        <div id="gameContainer">
            {<HandContainer
                key={0}
                playerIndex={0}
                {...[] as any}
            />}
            <BoardContainer />
            {<HandContainer
                key={1}
                playerIndex={1}
                {...[] as any}
            />}
            <ControlsContainer />
        </div>
    );
}