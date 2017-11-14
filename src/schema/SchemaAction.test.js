/* global it, describe, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';
import axios from 'axios';

import * as actionTypes from './SchemaActionTypes';
import * as actions from './SchemaActions';

chai.use(spies);

chai.should();

const _get = axios.get;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('SchemaActions ', () => {
  afterEach(() => {
    axios.get = _get;
  });

  it('should create FETCH_SUCCESS when fetching config has finished', async () => {
    const storeObject = {
      authReducer: {
        tokenId: 'tokenId'
      },
      configReducer: {
        gohan: {
          url: 'http://localhost',
          schema: '/schema'
        }
      }
    };
    const store = mockStore(storeObject);

    axios.get = chai.spy((url, headers) => {
      url.should.equal('http://localhost/schema');
      headers.headers['Content-Type'].should.equal('application/json');
      headers.headers['X-Auth-Token'].should.equal('tokenId');

      return Promise.resolve({
        data: {
          schemas: [
            {
              id: 'sample1',
              path: 'sample1'
            },
            {
              id: 'sample2',
              parent: 'sample1',
              path: 'sample2'
            }
          ]
        }
      });
    });
    await store.dispatch(actions.fetchSchema());

    store.getActions().should.deep.equal([
      {
        type: actionTypes.FETCH_SUCCESS,
        data: [
          {
            id: 'sample1',
            path: 'sample1',
            children: [
              'sample2'
            ]
          },
          {
            id: 'sample2',
            path: 'sample2',
            parent: 'sample1',
            children: []
          }
        ]
      }
    ]);
  });

  it('should create FETCH_ERROR when fetching config has been done', async () => {
    const storeObject = {
      authReducer: {
        tokenId: 'tokenId'
      },
      configReducer: {
        gohan: {
          url: 'http://localhost',
          schema: '/schema'
        }
      }
    };
    const store = mockStore(storeObject);

    axios.get = chai.spy((url, headers) => {
      url.should.equal('http://localhost/schema');
      headers.headers['Content-Type'].should.equal('application/json');
      headers.headers['X-Auth-Token'].should.equal('tokenId');

      return Promise.reject({
        response: {
          data: 'Cannot fetch data'
        }
      });
    });
    await store.dispatch(actions.fetchSchema());

    store.getActions().should.deep.equal([
      {
        type: actionTypes.FETCH_ERROR,
        error: 'Cannot fetch data'
      }
    ]);
  });
});
