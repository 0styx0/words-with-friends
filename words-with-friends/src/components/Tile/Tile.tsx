import * as React from 'react';
import Tile from './';
import { DragSource } from 'react-dnd';
import Game from '../../classes/Game';

interface Props {
    letter: string;
    points: number;
    connectDragSource?: Function;
    isDragging?: Function;
    removeTile: Function;
    canDrag: boolean;
    coordinates: string;
}

interface State {
    stop: boolean;
}

function collect(connect: {dragSource: Function}, monitor: {isDragging: Function}) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const source = {

  canDrag(props: Props) {

        const data = Game.board.get(props.coordinates);

        if (!data) {
            return true;
        }

        return props.canDrag && (data.turnTileWasPlaced === Game.turn || data.turnTileWasPlaced === 0);
  },

  beginDrag(props: Props) {
    return props;
  },
  endDrag(props: Props, monitor: any, senderComponent: any) {

      if (monitor.didDrop()) {
          senderComponent.props.removeTile();
      }
  }
};

@DragSource('tile', source, collect)
export default class TileContainer extends React.Component<Props, State> {

    constructor() {
        super();
    }

    render() {

        const { connectDragSource, isDragging } = this.props as {connectDragSource: Function, isDragging: Function };

        return connectDragSource(
            <div
              style={{
                opacity: isDragging ? 0.99 : 1,
                fontSize: 25,
                fontWeight: 'bold',
                cursor: 'move'
              }}
            >
                <Tile {...this.props} />
            </div>
        );
    }

}