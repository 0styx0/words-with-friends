import { cloneClassInstance } from './helpers';
import Powerup from '../classes/Powerup';


describe('helpers', () => {

    describe('#cloneClassInstance', () => {

        it('creates copy of class (not reference)', () => {

            const firstTarget = 'letter';
            const secondTarget = 'word';
            const firstPowerup = new Powerup(firstTarget, 2);
            const secondPowerup: Powerup = cloneClassInstance(firstPowerup);

            secondPowerup.target = secondTarget;

            expect(firstPowerup.target).toBe(firstTarget);
            expect(secondPowerup.target).toBe(secondTarget);
        });

    });
});