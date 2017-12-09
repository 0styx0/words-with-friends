import reducers from './reducers';
import { createStore } from 'redux';

export const defaultState = {
    turn: 0
};

const store = createStore(reducers, defaultState);

export default store;
