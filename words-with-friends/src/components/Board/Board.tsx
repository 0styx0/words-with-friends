import * as React from 'react';
import Board from './';
import TileHolder from '../TileHolder/TileHolder';

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

            for (let j = 0; j < 15; j++) {

                board.push(
                    <TileHolder
                        coordinates={`${i}, ${j}`}
                        key={`${i}, ${j}`}
                        {...[] as any}
                    /> as {} as typeof TileHolder
                );
            }
        }

        this.setState({
            board
        });
    }

    render() {
        return <Board board={this.state.board} />;
    }
}