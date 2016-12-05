import DetailView from './DetailView';

import {injectReducer} from '../app/reducers';

import reducer from './detailReducer';

export default store => {
  injectReducer(store, {key: 'detailReducer', reducer});

  return DetailView;
};

