import * as React from 'react';
import TileHolder from './';
import TileType from '../../interfaces/Tile';
import { DropTarget } from 'react-dnd';
import Game from '../../classes/Game';

interface Props {
    tile?: TileType;
    connectDropTarget?: Function;
    isOver?: Function;
    canDrag: boolean;
    coordinates: string;
}

interface State {
    tile?: TileType;
}

const tileTarget = {

    drop(props: any, monitor: any, component: TileHolderContainer) {

        const tile = monitor.getItem();

        component.putTile(tile);
    },

    hover(props: any, monitor: any, component: TileHolderContainer) {

        // making this.canDrop.property as the indicator since if create separate property, typescript error
        (this.canDrop as any).coordinates = component.props.coordinates;
        (this.canDrop as any).filled = !!component.state.tile;
    },

    canDrop(props: any, monitor: any) {

        const coordinates = (this.canDrop as any).coordinates;
        const filled = (this.canDrop as any).filled;

        const data = Game.board.get(coordinates);

        const spaceInPlayerHand = !data;
        if (spaceInPlayerHand && !filled) {
            return true;
        }

        const spaceOnBoard = !!data;
        if (spaceOnBoard && !data!.filled) {
            return true;
        }

        return false;
    }
};

function collect(connect: any, monitor: any) {

  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

export class TileHolderContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super();

        this.removeTile = this.removeTile.bind(this);

        this.state = {};

        if (props.tile) { // there will always be props.tile, but need to satisfy typescript

            this.state = {
                tile: props.tile
            };
        }

    }

    /**
     * Puts tile down (@see tileTarget.drop)
     */
    putTile(tile: TileType) {

        this.setState({
           tile: tile
        });

        if (this.props.coordinates) {

            const tileInfo = Game.board.get(this.props.coordinates)!;
            tileInfo.place(tile);
            Game.board.set(this.props.coordinates, tileInfo);
        }

    }

    /**
     * Removes tile from TileHolder (@see Tile.tsx#source.endDrag)
     */
    removeTile() {

        this.setState({
            tile: undefined
        });

        if (this.props.coordinates) {

            const tileInfo = Game.board.get(this.props.coordinates)!;
            tileInfo.reset();

            Game.board.set(this.props.coordinates, tileInfo);
        }
    }

    render() {

        const { connectDropTarget, isOver } = this.props as {connectDropTarget: Function, isOver: Function};
        
        return connectDropTarget(
            <div
              className="tileHolder"
              style={{
                  position: 'relative'
              }}
            >
                <TileHolder coordinates={this.props.coordinates} canDrag={this.props.canDrag} {...this.state} removeTile={this.removeTile} />
                {isOver &&
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        zIndex: 1,
                        opacity: 0.5,
                        backgroundColor: 'red',
                      }}
                    />
                }
            </div>
        );
    }
}

export default DropTarget('tile', tileTarget, collect)(TileHolderContainer);
