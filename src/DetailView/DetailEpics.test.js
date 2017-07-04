/* global it, describe, afterEach */
import Rx from 'rxjs';
import Ajax from 'rxjs/observable/dom/ajax';
import {createEpicMiddleware} from 'redux-observable';
import configureMockStore from 'redux-mock-store';

import chai from 'chai';
import spies from 'chai-spies';

import * as actionTypes from './DetailActionTypes';
import * as epics from './DetailEpics';

chai.use(spies);
chai.should();

const _ajax = Rx.Observable.ajax;

const epicMiddleware = createEpicMiddleware(epics.detailFetch);
const mockStore = configureMockStore([epicMiddleware]);

describe('DetailEpics', () => {
  describe('detailFetch()', () => {
    afterEach(() => {
      // noinspection JSAnnotator
      Ajax.ajax = _ajax;
      epicMiddleware.replaceEpic(epics.detailFetch);
    });

    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action`, () => {
      const store = mockStore(
        {
          detailReducer: {
            url: '/v1/foo/bar/baz',
            singular: 'baz'
          },
          configReducer: {
            polling: false,
            gohan: {
              url: 'http://gohan.io'
            }
          },
          authReducer: {
            tokenId: 'sampleTokenId'
          }
        }
      );

      // noinspection JSAnnotator
      Ajax.ajax = options => {
        options.method.should.equal('GET');
        options.url.should.equal('http://gohan.io/v1/foo/bar/baz');
        options.headers['X-Auth-Token'].should.equal('sampleTokenId');
        return Rx.Observable.create(observer => {
          observer.next({
            response: {
              baz: {
                id: 'baz',
                name: 'name of baz'
              }
            }
          });
          observer.complete();
        });
      };

      store.dispatch({type: actionTypes.FETCH});

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH
        },
        {
          type: actionTypes.FETCH_SUCCESS,
          data: {
            id: 'baz',
            name: 'name of baz'
          }
        }
      ]);
    });

    it(`should dispatch ${actionTypes.FETCH_FAILURE} action`, () => {
      const store = mockStore(
        {
          detailReducer: {
            url: '/v1/foo/bar/baz',
            singular: 'baz'
          },
          configReducer: {
            polling: false,
            gohan: {
              url: 'http://gohan.io'
            }
          },
          authReducer: {
            tokenId: 'sampleTokenId'
          }
        }
      );

      // noinspection JSAnnotator
      Ajax.ajax = options => {
        options.method.should.equal('GET');
        options.url.should.equal('http://gohan.io/v1/foo/bar/baz');
        options.headers['X-Auth-Token'].should.equal('sampleTokenId');
        return Rx.Observable.create(observer => {
          observer.error({
            xhr: {
              response: 'Cannot fetch data'
            }
          });
        });
      };

      store.dispatch({type: actionTypes.FETCH});

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH
        },
        {
          type: actionTypes.FETCH_FAILURE,
          error: 'Cannot fetch data!'
        }
      ]);

    });
  });
});
