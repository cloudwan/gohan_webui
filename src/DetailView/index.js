import DetailView from './DetailView';

import {injectReducer} from '../app/reducers';

import reducer from './detailReducer';

export default DetailView;

export function onDetailEnter(store) {
  injectReducer(store, {key: 'detailReducer', reducer});
}
