import TableView from './TableView';
import {injectReducer} from '../app/reducers';
import reducer from './tableReducer';

export default store => {
  injectReducer(store, {key: 'tableReducer', reducer});

  return TableView;
};

