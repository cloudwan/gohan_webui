import {injectEpic} from '../app/epics';
import {detailFetch} from './DetailEpics';

import {injectReducer} from '../app/reducers';

import reducer from './detailReducer';

export * from './DetailView';

export function onDetailEnter(store) {
  injectReducer(store, {key: 'detailReducer', reducer});
  injectEpic(store, {key: 'detailEpic', epic: detailFetch});
}
