import store, { getState } from '../../store';
import TileInfo from '../../classes/TileInfo';
import putTileOnBoard from '../../actions/putTileOnBoard';

export default function addCoordinatesToStore(tileInfos: ReadonlyArray<TileInfo>, coordinates: number[][]) {

    for (let i = 0; i < tileInfos.length; i++) {

        const state = getState();

        store.dispatch(
            putTileOnBoard(
                tileInfos[i].tile!, coordinates[i], state.Players, state.turn
            )
        );
    }
}

