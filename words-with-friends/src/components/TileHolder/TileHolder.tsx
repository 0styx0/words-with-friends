import * as React from 'react';
import TileHolder from './';
import TileType from '../../interfaces/Tile';
import { DropTarget } from 'react-dnd';

interface Props {
    tile?: TileType;
    connectDropTarget?: Function;
    isOver?: Function;
}

interface State {
    tile: TileType;
}

const tileTarget = {
  drop(props: any, monitor: any, component: any) {
      console.log(monitor.getItem(), component.putTile(monitor.getItem()));
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

        if (props.tile) { // there will always be props.tile, but need to satisfy typescript
            this.state = {
                tile: props.tile
            };
        }

    }

    putTile(tile: TileType) {

        this.setState({
           tile: tile
        });
    }

    render() {

        const { connectDropTarget, isOver } = this.props as {connectDropTarget: Function, isOver: Function};

        return connectDropTarget(
            <div
              className="tileHolder"
              style={{
                  position: 'relative',
              }}
            >
                <TileHolder {...this.state} />
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
