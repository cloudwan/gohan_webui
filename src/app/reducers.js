import {combineReducers} from 'redux';

import configReducer from './../config/configReducer';
import locationReducer from '../location/locationReducer';
import errorReducer from './../error/errorReducer';
import authReducer from './../auth/authReducer';
import schemaReducer from './../schema/schemaReducer';
import dialogReducer from '../Dialog/dialogReducer';

export const makeRootReducer = asyncReducers => {
  return combineReducers({
    configReducer,
    locationReducer,
    errorReducer,
    authReducer,
    schemaReducer,
    dialogReducer,
    ...asyncReducers
  });
};

export const injectReducer = (store, {key, reducer}) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
