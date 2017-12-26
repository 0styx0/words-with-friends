import { ResetTilebag } from '../actions/interfaces';
import types from '../actions/types';
import TilebagClass from '../classes/Tilebag';

export default function Tilebag(tilebag: any = {}, action: ResetTilebag) {

    switch (action.type) {

        case types.RESET_TILEBAG:
            return new TilebagClass();
        default:
            return tilebag;
    }
}