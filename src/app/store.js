import {createStore, applyMiddleware} from 'redux';
import {createEpicMiddleware} from 'redux-observable';
import thunk from 'redux-thunk';
import makeRootReducer from './reducers';
import {rootEpic} from './epics';

const epicMiddleware = createEpicMiddleware(rootEpic);

const createStoreWithMiddleware = applyMiddleware(epicMiddleware, thunk)(createStore);
export default function store(initialState) {
  const store = createStoreWithMiddleware(makeRootReducer(), initialState);

  store.asyncEpics = {};
  store.asyncReducers = {};

  return store;
}
