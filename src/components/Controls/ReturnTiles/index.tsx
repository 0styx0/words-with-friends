import * as React from 'react';

interface Props {
    returnTiles: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ReturnTiles(props: Props) {
    return <button onClick={props.returnTiles}>Return Tiles</button>;
}
