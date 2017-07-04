import {Observable} from 'rxjs';
import {ajax} from 'rxjs/observable/dom/ajax';

import {FETCH, FETCH_CANCELLED} from './DetailActionTypes';
import {fetchSuccess, fetchError} from './DetailActions';

const pollingInterval = 5000; // Time in ms

export const detailFetch = (action$, store) => {
  return action$.ofType(FETCH)
    .mergeMap(() => {
      const state = store.getState();
      const {url, singular} = state.detailReducer;
      const {polling} = state.configReducer;
      const {url: gohanUrl} = state.configReducer.gohan;
      const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': state.authReducer.tokenId
      };

      return ajax({method: 'GET', url: `${gohanUrl}${url}`, headers, crossDomain: true})
        .map(response => fetchSuccess(response.response[singular]))
        .catch(error => {
          console.error(error);
          return Observable.of(fetchError('Cannot fetch data!'));
        })
        .repeatWhen(params => params.delay(pollingInterval).takeWhile(() => Boolean(polling)))
        .takeUntil(action$.ofType(FETCH_CANCELLED));
    }
    );
};
