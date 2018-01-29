import Tilebag from './Tilebag';
import types from '../actions/types';
import TilebagClass from '../classes/Tilebag';

describe('Tilebag', () => {

    describe('init', () => {

        it('returns new Tilebag', () => {

            const tilebag = Tilebag({}, {
                type: types.RESET_TILEBAG
            });

            expect(tilebag).toEqual(new TilebagClass());
        });
    });
});