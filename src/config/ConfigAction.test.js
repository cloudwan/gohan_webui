/* global it, describe, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';

import * as actionTypes from './ConfigActionTypes';
import * as actions from './ConfigActions';

chai.use(sinonChai);

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

    axios.get = sinon.spy(() => Promise.resolve({
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
          },
          substringSearchEnabled: true
        }
      }
    ]);

    // Else statements
    store.clearActions();

    axios.get = sinon.spy(() => Promise.resolve({
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
          },
          substringSearchEnabled: true
        }
      }
    ]);
  });

  it('should creates FETCH_ERROR when fetching config has been done', async () => {
    axios.get = sinon.spy(() => Promise.reject({
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

  it(`should dispatch ${actionTypes.FETCH_APP_VERSION_SUCCESS} when fetching versions has been done`, async () => {
    const store = mockStore({
      authReducer: {
        tokenId: 'foo'
      },
      configReducer: {
        gohan: {
          url: 'http://url',
          schema: '/path/schemas'
        }
      }
    });

    axios.get = sinon.spy(() => Promise.resolve({
      data: {
        app: 'app',
        version: '1972382972394823'
      }
    }));

    await store.dispatch(actions.fetchAppVersion());

    store.getActions().should.deep.equal([
      {
        type: actionTypes.FETCH_APP_VERSION_SUCCESS,
        data: {
          app: 'app',
          version: '1972382972394823'
        }
      }
    ]);
  });

  it(`should dispatch ${actionTypes.FETCH_APP_VERSION_FAILURE}` +
    ' when fetching versions finished with error', async () => {
    axios.get = sinon.spy(() => Promise.reject({
      response: {
        data: 'Cannot fetch data'
      }
    }));

    const expectedActions = [
      {
        type: actionTypes.FETCH_APP_VERSION_FAILURE,
        error: 'Cannot fetch data'
      }
    ];

    const store = mockStore({
      authReducer: {
        tokenId: 'foo'
      },
      configReducer: {
        gohan: {
          url: 'http://url',
          schema: '/path/schemas'
        }
      }
    });

    await store.dispatch(actions.fetchAppVersion());

    store.getActions().should.deep.equal(expectedActions);
  });
});
