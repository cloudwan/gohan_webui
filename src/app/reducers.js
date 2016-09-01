import {combineReducers} from 'redux';
import configReducer from './../config/configReducer';
import errorReducer from './../error/errorReducer';

export default combineReducers({
  configReducer,
  errorReducer
});
