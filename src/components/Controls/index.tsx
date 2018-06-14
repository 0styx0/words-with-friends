import * as React from 'react';
import './index.css';
import Turn from './Turn/Turn';
import PlayerContainer from '../Player/Player';
import ReturnTilesContainer from './ReturnTiles/ReturnTiles';

export default function Controls(): any {

    return [
        <PlayerContainer key={0} playerIndex={0} {...[] as any} />,
        (
            <section key="controls" id="controls">
                <Turn {...[] as any} />
                <ReturnTilesContainer {...[] as any} />
            </section>
        ),
        <PlayerContainer key={1} playerIndex={1} {...[] as any} />
    ];
}


