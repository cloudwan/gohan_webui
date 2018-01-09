import {combineReducers} from 'redux';

import configReducer from './../config/configReducer';
import locationReducer from './../location/locationReducer';
import errorReducer from './../Error/errorReducer';
import authReducer from './../Auth/authReducer';
import uiSchemaReducer from './../uiSchema/uiSchemaReducer';
import schemaReducer from './../schema/schemaReducer';
import dialogReducer from './../Dialog/dialogReducer';
import customActionReducer from './../CustomActions/customActionReducer';
import apiRequestReducer from './../ApiRequest/apiRequestReducer';
import breadcrumbReducer from './../Breadcrumbs/breadcrumbsReducer';
import tableReducer from './../TableView/tableReducer';
import detailReducer from './../DetailView/detailViewReducer';

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
