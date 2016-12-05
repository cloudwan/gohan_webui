/* global it, describe, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';
import axios from 'axios';

import * as actionTypes from './ConfigActionTypes';
import * as actions from './ConfigActions';

chai.use(spies);

chai.should();

const _get = axios.get;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ConfigActions ', () => {
  afterEach(() => {
    axios.get = _get;
  });

  it('should creates FETCH_SUCCESS when fetching config has been done', async () => {
    const store = mockStore({});

    axios.get = chai.spy(() => Promise.resolve({
      data: {
        authUrl: 'http://__HOST__:9091/v2.0',
        gohan: {
          url: 'http://__HOST__:9091'
        }
      }
    }));
    await store.dispatch(actions.fetchConfig());

    store.getActions().should.deep.equal([
      {
        type: actionTypes.FETCH_SUCCESS,
        data: {
          authUrl: 'http://localhost:9091/v2.0',
          gohan: {
            url: 'http://localhost:9091'
          }
        }
      }
    ]);

    // Else statements
    store.clearActions();

    axios.get = chai.spy(() => Promise.resolve({
      data: {
        authUrl: 'http://192.168.1.11:9091/v2.0',
        gohan: {
          url: 'http://192.168.1.11:9091'
        }
      }
    }));
    await store.dispatch(actions.fetchConfig());

    store.getActions().should.deep.equal([
      {
        type: actionTypes.FETCH_SUCCESS,
        data: {
          authUrl: 'http://192.168.1.11:9091/v2.0',
          gohan: {
            url: 'http://192.168.1.11:9091'
          }
        }
      }
    ]);
  });

  it('should creates FETCH_ERROR when fetching config has been done', async () => {
    axios.get = chai.spy(() => Promise.reject({
      response: {
        data: 'Cannot fetch data'
      }
    }));

    const expectedActions = [
      {
        type: actionTypes.FETCH_ERROR, error: 'Cannot fetch data'
      }
    ];
    const store = mockStore({});

    await store.dispatch(actions.fetchConfig());

    store.getActions().should.deep.equal(expectedActions);
  });
});
