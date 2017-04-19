import {injectReducer} from '../app/reducers';
import reducer from './tableReducer';

import {initialize, fetchData, clearData} from './TableActions';

export * from './TableView';

export function onTableEnter(store, plural, nextState, parentUrl = '') {
  let filters;

  injectReducer(store, {key: 'tableReducer', reducer});

  if (nextState.location.query.filters) {
    try {
      filters = JSON.parse(nextState.location.query.filters);
    } catch (error) {
      console.error(error);
    }
  }

  const {
    sortKey,
    sortOrder,
    limit = 0,
    offset = 0,
  } = nextState.location.query;

  store.dispatch(
    initialize(
      `${parentUrl}/${plural}`, plural,
      {
        sortKey,
        sortOrder,
        limit,
        offset,
        filters
      }
    )
  );

  store.dispatch(
    fetchData(plural)
  );
}


export function onTableLeave(store, plural) {
  store.dispatch(clearData(plural));
}
