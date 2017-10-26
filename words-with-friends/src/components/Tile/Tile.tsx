import * as React from 'react';
import Tile from './';
import { DragSource } from 'react-dnd';

interface Props {
    letter: string;
    points: number;
    connectDragSource?: Function;
    isDragging?: Function;
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
  beginDrag(props: Props) {
    return props;
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