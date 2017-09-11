import {combineReducers} from 'redux';

import configReducer from './../config/configReducer';
import locationReducer from '../location/locationReducer';
import errorReducer from './../error/errorReducer';
import authReducer from './../auth/authReducer';
import uiSchemaReducer from './../uiSchema/uiSchemaReducer';
import schemaReducer from './../schema/schemaReducer';
import dialogReducer from '../Dialog/dialogReducer';
import customActionReducer from '../CustomActions/CustomActionReducer';
import apiRequestReducer from '../apiRequest/ApiRequestReducer';

export const makeRootReducer = asyncReducers => {
  return combineReducers({
    configReducer,
    locationReducer,
    errorReducer,
    authReducer,
    schemaReducer,
    uiSchemaReducer,
    dialogReducer,
    customActionReducer,
    apiRequestReducer,
    ...asyncReducers
  });
};

export const injectReducer = (store, {key, reducer}) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
