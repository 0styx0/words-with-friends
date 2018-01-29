import * as React from 'react';
import './index.css';
import TileType from '../../interfaces/Tile';
import store, { getState } from '../../store';
import { ChangeEvent } from 'react';

interface Props {
    tile: TileType;
    coordinates?: number[];
    canDrag?: boolean;
}

function onWildcardChange(event: ChangeEvent<HTMLSelectElement>, coordinates?: number[]) {

    if (!coordinates) {
        return;
    }

    const board = getState().board;
    const tileInfo = board.get(coordinates)!;

    if (tileInfo.tile!.points > 0 || !tileInfo.recent(getState().turn)) {

        if (tileInfo) {
            event.target.value = tileInfo.tile!.letter;
            event.target.disabled = true;
        }
        return;
    }

    store.dispatch({
        type: 'PLACE_TILE_ON_BOARD',
        tile: {
            letter: event.target.value,
            points: 0,
            playerIndex: tileInfo.tile!.playerIndex
        },
        coordinates
    });
}

export default function Tile(props: Props) {

    return (
        <div
            className="tile"
        >
            <span className="points">{props.tile.points}</span>
            {props.tile.points === 0 ?
                <select
                    disabled={!props.canDrag}
                    onChange={(event) => onWildcardChange(event, props.coordinates)}
                >
                    {new Array(26)
                        .fill('', 0, 26)
                        .map((elt, i) =>
                        <option key={i}>{String.fromCharCode(i + 65)}</option>)}
                </select>
                :
                <span
                    className="letter"
                >
                    {props.tile.letter}
                </span>
            }
        </div>
    );
}
