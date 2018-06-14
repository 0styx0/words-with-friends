import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import store, { getState } from '../../../store';
import { mount } from 'enzyme';
import ConnectedReturnTiles from './ReturnTiles';
import placeWord from '../../../test/helpers/placeWord';
import getWord from '../../../test/helpers/getWord';
import addCoordinatesToStore from '../../../test/helpers/addCoordinatesToStore';
import Board from '../../../classes/Board';

describe(`<ReturnTiles />`, () => {

    describe('render', () => {

        it('renders properly', () => {

            const tree = renderer.create(
                <Provider store={store} >
                  <ConnectedReturnTiles {...[] as any} />
                </Provider>
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });

    function setup() {

        return mount(
            <Provider store={store} >
              <ConnectedReturnTiles {...[] as any} />
            </Provider>
        );
    }

    describe(`#returnTiles`, () => {

        const wrapper = setup();
        const centerCoordinates =
          [+process.env.REACT_APP_CENTER_COORDINATE!, +process.env.REACT_APP_CENTER_COORDINATE!];

        it(`it returns tiles placed in last turn to current player's hand`, () => {

            const { tileInfos, coordinates } = placeWord(getWord(), centerCoordinates, true, new Board(), 1);
            addCoordinatesToStore(tileInfos, coordinates);

            const playerTilesBeforeTileRecall = getState().Players[0].tiles;
            expect(playerTilesBeforeTileRecall).toHaveLength(0);

            wrapper.find('button').simulate('click');

            const playerTilesAfterTileRecall = getState().Players[0].tiles;
            expect(playerTilesAfterTileRecall).toEqual(tileInfos.map(tileInfo => tileInfo.tile));
        });


        it(`takes those tiles off the board`, () => {

            const { tileInfos, coordinates } = placeWord(getWord(), centerCoordinates, true, new Board(), 1);
            addCoordinatesToStore(tileInfos, coordinates);

            wrapper.find('button').simulate('click');

            coordinates.forEach(coordinate => {
                expect(getState().board.get(coordinate)!.filled).toBeFalsy();
            });

        });
    });
});
