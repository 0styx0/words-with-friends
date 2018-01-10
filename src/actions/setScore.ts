import types from './types';
import PlayerClass from '../classes/Player';
import { SetScore } from './interfaces';

export default function setScore(Players: ReadonlyArray<Readonly<PlayerClass>>, score: number): SetScore {
    return {
        type: types.SET_SCORE,
        Players,
        score
    };
}