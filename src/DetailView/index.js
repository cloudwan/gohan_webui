import {injectEpic} from '../app/epics';
import DetailView from './DetailView';
import {detailFetch} from './DetailEpics';

import {injectReducer} from '../app/reducers';

import reducer from './detailReducer';

export default DetailView;

export function onDetailEnter(store) {
  injectReducer(store, {key: 'detailReducer', reducer});
  injectEpic(store, {key: 'detailEpic', epic: detailFetch});
}
