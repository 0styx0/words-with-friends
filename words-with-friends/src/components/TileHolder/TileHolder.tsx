import * as React from 'react';
import TileHolder from './';
import TileType from '../../interfaces/Tile';
import { DropTarget } from 'react-dnd';

interface Props {
    tile?: TileType;
    connectDropTarget?: Function;
    isOver?: Function;
}


const tileTarget = {
  drop(props: any, monitor: any) {
      console.log(monitor.getItem());
  }
};

function collect(connect: any, monitor: any) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

@DropTarget('tile', tileTarget, collect)
export default class TileHolderContainer extends React.Component<Props, {}> {

    render() {

        const { connectDropTarget, isOver } = this.props as {connectDropTarget: Function, isOver: Function};

        return connectDropTarget(
            <div
              className="tileHolder"
              style={{
                  position: 'relative',
              }}
            >
                <TileHolder {...this.props} />
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