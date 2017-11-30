export default class Powerup {

    target: 'letter' | 'word';
    multiplyBy: number;
    name: 'DL' | 'DW' | 'TL' | 'TW' | '';

    constructor(target: 'letter' | 'word', multiplyBy: number) {

        this.target = target;
        this.multiplyBy = multiplyBy;

        this.name = this.setPowerup();

    }

    setPowerup() {

        switch (this.target) {
            case 'letter':
                return this.multiplyBy === 2 ? 'DL' : 'TL';
            case 'word':
                return this.multiplyBy === 2 ? 'DW' : 'TW';
            default:
                return '';
        }
    }
}


// tw = 8
// tl = 16
// dl = 24
// dw = 12