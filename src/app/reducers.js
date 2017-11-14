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
import breadcrumbReducer from '../breadcrumb/breadcrumbReducer';
import tableReducer from '../TableView/tableReducer';
import detailReducer from '../DetailView/detailReducer';

export const makeRootReducer = asyncReducers => {
  return combineReducers({
    tableReducer,
    detailReducer,
    configReducer,
    locationReducer,
    errorReducer,
    authReducer,
    schemaReducer,
    uiSchemaReducer,
    dialogReducer,
    customActionReducer,
    apiRequestReducer,
    breadcrumbReducer,
    ...asyncReducers
  });
};

export const injectReducer = (store, {key, reducer}) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
