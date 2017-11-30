import * as React from 'react';
import './index.css';
import Tilebag from '../../classes/Tilebag';
import Tile from '../../interfaces/Tile';
import Hand from './';


interface State {
    tiles: Tile[];
    removedTiles: Tile[];
}

interface Props {
    className?: string;
    canDrag: boolean;
}

export default class HandContainer extends React.Component<Props, State> {

    constructor() {
        super();

        this.state = {
            tiles: [],
            removedTiles: []
        };
    }

    componentDidMount() {

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
            tiles.push(Tilebag.getRandomTile());
        }

        this.setState({
           tiles: tiles,
           removedTiles: []
        });
    }

    render() {

        return (
            <Hand
              key={+this.props.canDrag}
              tiles={this.state.tiles}
              canDrag={this.props.canDrag}
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