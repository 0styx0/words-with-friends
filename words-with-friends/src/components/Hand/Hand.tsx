import * as React from 'react';
import './index.css';
import Tilebag from '../../classes/Tilebag';
import Tile from '../../interfaces/Tile';
import Hand from './';

interface Props {
    className?: string;
    playerIndex: number;
    turn: boolean;
}

interface State {
    tiles: Tile[];
    removedTiles: Tile[];
}

export default class HandContainer extends React.Component<Props, State> {

    constructor() {
        super();

        this.state = {
            tiles: [],
            removedTiles: []
        };
    }

    componentWillMount() {

        this.generateTiles();
    }

    componentWillReceiveProps() {

        const tiles = [...this.state.tiles];

        // remove tiles that were put on the board
        this.state.removedTiles.map(tile => {

            const indexOfTile = tiles.indexOf(tile);
            tiles.splice(indexOfTile, 1);
        });

        this.generateTiles(tiles); // after a turn, canDrag is updated so latching onto that
    }

    /**
     * Sets state so there is a full hand of Tiles
     */
    generateTiles(tiles: Tile[] = []) {

        while (tiles.length < 7 && Tilebag.tiles.length > 0) {
            const tile = Tilebag.getRandomTile(this.props.playerIndex);
            tiles.push(tile);
        }

        this.setState({
            tiles,
            removedTiles: []
        });
    }

    render() {

        return (
            <Hand
              key={+this.props.turn}
              tiles={this.state.tiles}
              className={this.props.className}
              removeTile={(tile: Tile) => {
                  this.setState({
                      removedTiles: this.state.removedTiles.concat([tile])
                  });
              }}
            />
        );
    }
}