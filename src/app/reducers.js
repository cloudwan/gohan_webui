import {combineReducers} from 'redux';
import configReducer from './../config/configReducer';
import locationReducer from './../routes/locationReducer';
import errorReducer from './../error/errorReducer';
import authReducer from './../auth/authReducer';
import schemaReducer from './../schema/schemaReducer';
import dialogReducer from './../dialog/dialogReducer';
import dynamicReducer from './../dynamicRoutes/dynamicReducer';

export default combineReducers({
  configReducer,
  locationReducer,
  errorReducer,
  authReducer,
  schemaReducer,
  dialogReducer,
  dynamicReducer
});
