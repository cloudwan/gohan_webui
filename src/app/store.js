import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import makeRootReducer from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export default function store(initialState) {
  const store = createStoreWithMiddleware(makeRootReducer(), initialState);

  store.asyncReducers = {};

  return store;
}
