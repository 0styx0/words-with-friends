import * as React from 'react';
import HandContainer from '../components/Hand/Hand';
import Player from './Player';

export default class Game {

    static Players: Player[] = [new Player(), new Player()];

    static init() {

        Game.Players[0].turn = true;

        // trying to put a hand in each player
        Game.Players.forEach((player, i) => {

            const className = (i === 1) ? 'rightHand' : '';

           player.hand = (<HandContainer className={className} canDrag={player.turn} /> as any);
        });
    }
}