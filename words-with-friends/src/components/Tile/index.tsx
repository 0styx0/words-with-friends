import * as React from 'react';
import './index.css';
import Game from '../../classes/Game';

interface Props {
    letter: string;
    points: number;
    coordinates?: string;
    canDrag?: boolean;
}

function onWildcardChange(event: any, coordinates?: string) {

    if (!coordinates) {
        return;
    }
    const tileInfo = Game.board.get(coordinates)!;

    if (tileInfo.tile!.points > 0 || !tileInfo.recent) {

        if (tileInfo) {
            event.target.value = tileInfo.tile!.letter;
            event.target.disabled = true;
        }
        return;
    }

    tileInfo.tile = { letter: event.target.value, points: 0 };

    Game.board.set(coordinates, tileInfo);
}

export default function Tile(props: Props) {

    const tileInfo = (props.coordinates && Game.board.get(props.coordinates)!) || {} as any;

    return (
            <div className="tile">
            <span className="points">{props.points}</span>
            {props.letter === '' ?
                <select disabled={!(!!props.canDrag && !!tileInfo && tileInfo.canDrag)} onChange={(event) => onWildcardChange(event, props.coordinates)}>
                    {new Array(26)
                        .fill('', 0, 26)
                        .map((elt, i) =>
                        <option key={i}>{String.fromCharCode(i + 65)}</option>)}
                </select>
                :
                <span
                    className="letter"
                >
                    {props.letter}
                </span>
            }
            </div>
    );
}
