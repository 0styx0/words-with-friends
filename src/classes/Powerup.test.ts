import Powerup from './Powerup';

describe('Powerup', () => {

    describe('constructor should properly set', () => {

        function testPowers(target: 'word' | 'letter' = 'word', multiplyBy: number = 2) {

            const symbolExpected = ((multiplyBy === 2) ? 'D' : 'T') + target[0].toUpperCase();

            const powerup = new Powerup(target, multiplyBy);

            expect(powerup.multiplyBy).toBe(multiplyBy);
            expect(powerup.name).toBe(symbolExpected);
            expect(powerup.target).toBe(target);
        }

        it('TW', () => testPowers('word', 3));

        it('DW', () => testPowers('word', 2));

        it('TL', () => testPowers('letter', 3));

        it('DL', () => testPowers('letter', 2));
    });
});

