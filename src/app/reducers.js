import {combineReducers} from 'redux';
import configReducer from './../config/configReducer';
import errorReducer from './../error/errorReducer';
import authReducer from './../auth/authReducer';
import schemaReducer from './../schema/schemaReducer';

export default combineReducers({
  configReducer,
  errorReducer,
  authReducer,
  schemaReducer
});
