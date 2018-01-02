import types from './types';
import PlayerClass from '../classes/Player';
import { SetScore } from './interfaces';

export default function setScore(Player: Readonly<PlayerClass>, score: number): SetScore {
    return {
        type: types.SET_SCORE,
        Player,
        score
    };
}