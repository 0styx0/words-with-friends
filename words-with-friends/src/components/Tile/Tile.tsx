import * as React from 'react';
import Tile from './';
// import { DragSource } from 'react-dnd';
import Game from '../Game/Game';

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

// function collect(connect: {dragSource: Function}, monitor: {isDragging: Function}) {
//   return {
//     connectDragSource: connect.dragSource(),
//     isDragging: monitor.isDragging()
//   };
// }

// const source = {

//   canDrag(props: Props) {

//         const data = Game.board.get(props.coordinates);

//         if (!data && props.canDrag) {
//             return true;
//         }

//         return props.canDrag && !!data && data.canDrag;
//   },

//   beginDrag(props: Props) {
//     return props;
//   },
//   endDrag(props: Props, monitor: any, senderComponent: any) {

//       if (monitor.didDrop()) {
//           senderComponent.props.removeTile();
//       }
//   }
// };

// @DragSource('tile', source, collect)
export default class TileContainer extends React.Component<Props, State> {

    constructor() {
        super();
    }


    onDragStart(e: any) {
        e.dataTransfer.setData('id', 'setTheId');
        console.log('onDragStart');
    }
    onDrop(e: any) {
        console.log('onDrop');
        const id = e.dataTransfer.getData('id');
        console.log('Dropped with id:', id);
    }





    render() {

        return (
            <div
                className="tileContainer"
                onDragStart={this.onDragStart}
                onDrop={this.onDrop}
                draggable={this.props.canDrag}
            >
                <Tile
                    key={Game.turn}
                    letter={this.props.letter}
                    points={this.props.points}
                    coordinates={this.props.coordinates}
                    canDrag={this.props.canDrag}
                />
            </div>
        );
    }

}