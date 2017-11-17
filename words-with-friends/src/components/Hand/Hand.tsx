import * as React from 'react';
import './index.css';
import tilebag from '../../services/tilebag';
import Tile from '../../interfaces/Tile';
import Hand from './';


interface State {
    tiles: Tile[];
}

interface Props {
    className?: string;
    canDrag: boolean;
}

export default class HandContainer extends React.Component<Props, State> {

    constructor() {
        super();

        this.state = {
            tiles: []
        };
    }

    componentDidMount() {

        this.generateTiles();
    }

    componentWillReceiveProps() {
        this.generateTiles(); // after a turn, canDrag is updated so latching onto that
    }

    /**
     * Sets state so there is a full hand of Tiles
     */
    generateTiles() {

        const tiles: Tile[] = [...this.state.tiles];

        while (tiles.length < 7 && tilebag.alphabet.size > 0) {
            tiles.push(tilebag.getRandomTile());
        }

        this.setState({
           tiles: tiles
        });
    }

    render() {

        return (
            <Hand
              key={+this.props.canDrag}
              tiles={this.state.tiles}
              canDrag={this.props.canDrag}
              className={this.props.className}
            />
        );
    }
}