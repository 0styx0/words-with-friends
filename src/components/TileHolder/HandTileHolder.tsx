import * as React from 'react';
import TileHolder from './';
import TileType from '../../interfaces/Tile';
import AbstractTileHolder from './AbstractTileHolder';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';
import Player from '../../classes/Player';
// import Computer from '../../classes/Computer';
import Board from '../../classes/Board';


function mapStateToProps(state: typeof defaultState, props: Props) {
    return {
        tile: props.tile,
        Players: state.Players,
        board: state.board,
        turn: state.turn
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}


type Props = typeof actionCreators & typeof defaultState & {
    tile?: TileType;
    Players: Player;
    board: Board;
    turn: number;
};


export class HandTileHolderContainer extends AbstractTileHolder<Props> {

    /*
    placeWord(computer: Computer) {
        
        const highestWord = computer.getHighestWord(
             computer.getPossibleWords(this.props.board, this.props.turn), this.props.board, this.props.turn
         );

        if (highestWord.horizontal) {

            for (
                let i = highestWord.startCoordinate[0];
                i < highestWord.startCoordinate[0] + highestWord.length;
                i++
            ) {
                this.putTile(computer.tiles.find(tile => tile.letter === highestWord.word[i])!);
            }
        }
    }
    */

    /**
     * Puts tile down (@see tileTarget.drop)
     */
    putTile(tile: TileType) {

        this.props.putTileInHand(this.props.Players, tile!);
    }

    /**
     * Removes tile from TileHolder (@see Tile.tsx#source.endDrag)
     */
    removeTile() {
        this.props.removeTileFromHand(this.props.Players, this.props.tile!);
    }

    render() {

        return (
            <div
              className="tileHolder"
              onDrop={this.onDrop}
              onDragOver={this.onDragOver}
            >
                <TileHolder
                    tile={this.props.tile}
                    removeTile={this.removeTile}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HandTileHolderContainer as any);
