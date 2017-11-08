import * as React from 'react';
import Board from './';
import TileHolder from '../TileHolder/TileHolder';
import Game from '../../classes/Game';

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

                board[i][j] = <TileHolder coordinates={`${i}, ${j}`} canDrag={true} key={`${i}, ${j}`} />;

                // const centerTile = i === 7 && j === 7;

                Game.board.set(`${i}, ${j}`, {
                    filled: false,
                    turnTileWasPlaced: 0,
                    recent: false
                });
            }
        }

        this.setState({
            board
        });
    }

    render() {
        return <Board tiles={this.state.board} />;
    }
}