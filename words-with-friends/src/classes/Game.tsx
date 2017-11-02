import * as React from 'react';
import HandContainer from '../components/Hand/Hand';
import Board from '../components/Board/Board';
import ControlsContainer from '../components/Controls/Controls';
import Player from './Player';

interface State {
    number: number;
}

export default class Game extends React.Component<{}, State> {

    static Players: Player[] = [new Player(), new Player()];

    constructor() {
        super();

        this.setHands = this.setHands.bind(this);
        this.turn = this.turn.bind(this);

        this.state = {
            number: 0
        };

    }

    componentWillMount() {

        Game.Players[0].turn = true;

        this.setHands();
    }

    setHands() {

        // trying to put a hand in each player
        Game.Players = Game.Players.map((player, i) => {

            const className = (i === 1) ? 'rightHand' : '';

            player.hand = (<HandContainer key={i} className={className} canDrag={player.turn} /> as any);

            return player;
        });

        this.setState({
            number: this.state.number + 1
        });
    }

    turn() {

        Game.Players.forEach(player => {
           player.turn = !player.turn;
        });

        this.setHands();
    }

    render() {
        
        return (
            <div>
                {Game.Players[0].hand}
                <Board />
                {Game.Players[1].hand}
                <ControlsContainer turn={this.turn} />
            </div>
        );
    }
}