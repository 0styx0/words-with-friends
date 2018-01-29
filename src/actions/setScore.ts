import { SetScore } from './interfaces';
import types from './types';

export default function setScore(score: number): SetScore {
    return {
        type: types.SET_SCORE,
        score
    };
}