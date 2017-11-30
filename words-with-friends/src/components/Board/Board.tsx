import * as React from 'react';
import Board from './';
import TileHolder from '../TileHolder/TileHolder';
import Game from '../Game/Game';
import TileInfo from '../../classes/TileInfo';
import Powerup from '../../classes/Powerup';

interface State {
    board: typeof TileHolder[];
}

export default class BoardContainer extends React.Component<{}, State> {

    constructor() {
        super();

        this.state = {
            board: []
        };
    }

    componentDidMount() {

        let board: typeof TileHolder[] = [];

        for (let i = 0; i < 15; i++) {

            board.push([] as any); // board = [[]]

            for (let j = 0; j < 15; j++) {

                const tileInfo = new TileInfo();

                if (Math.random().toString()[2] === '2') {

                    tileInfo.powerup = this.setPowerup();
                }

                Game.board.set(`${i}, ${j}`, tileInfo);

                board[i][j] = (
                    <TileHolder
                      coordinates={`${i}, ${j}`}
                      canDrag={true}
                      key={`${i}, ${j}`}
                    />
                );
            }
        }

        this.setState({
            board
        });
    }

    /**
     * Randomly sets powerups
     */
    setPowerup(): Powerup | undefined {

        return new Powerup(Math.random() > 0.5 ? 'letter' : 'word', Math.random() > 0.5 ? 2 : 3);
    }

    render() {
        return <Board tiles={this.state.board} />;
    }
}