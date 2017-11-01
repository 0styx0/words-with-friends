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

    /**
     * Sets state so there is a full hand of Tiles
     */
    generateTiles() {

        const tiles: Tile[] = [...this.state.tiles];

        while (tiles.length < 7) {
            tiles.push(tilebag.getRandomTile());
        }

        this.setState({
           tiles: tiles
        });
    }

    render() {

        return <Hand tiles={this.state.tiles} canDrag={this.props.canDrag} className={this.props.className} />;
    }
}