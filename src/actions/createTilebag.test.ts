import resetTilebag from './createTilebag';
import types from './types';

describe('resetTilebag', () => {

    it('should return RESET_TILEBAG type', () => {

        expect(resetTilebag()).toEqual({
            type: types.RESET_TILEBAG
        });
    });
});