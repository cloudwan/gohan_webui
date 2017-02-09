/* global it, afterEach, describe, sessionStorage */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';
import axios from 'axios';

import * as actionTypes from './AuthActionTypes';
import * as actions from './AuthActions';

chai.use(spies);
chai.should();

const _get = axios.get;
const _post = axios.post;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('AuthActions ', () => {
  afterEach(() => {
    sessionStorage.clear();
    sessionStorage.itemInsertionCallback = null;
  });

  describe('login() ', () => {
    afterEach(() => {
      axios.get = _get;
      axios.post = _post;
    });

    it('should create LOGIN_SUCCESS and TENANT_FETCH_SUCCESS', async () => {
      axios.post = chai.spy((url, data, headers) => {
        url.should.equal('http://localhost:8666/tokens');
        headers['Content-Type'].should.equal('application/json');

        return Promise.resolve({
          status: 200,
          data: {
            access: {
              token: {
                id: 'admin_token'
              }
            }
          }
        });
      });

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost:8666/tenants');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('admin_token');

        return Promise.resolve({
          status: 200,
          data: {
            tenants: [{
              id: 'sample_id_123',
              name: 'test tenant',
              description: null,
              enabled: true
            }, {
              id: 'sample_id_456',
              name: 'admin',
              description: 'admin tenant',
              enabled: true
            }]
          }
        });
      });

      const store = mockStore({
        configReducer: {
          authUrl: 'http://localhost:8666'
        },
        authReducer: {
          tokenId: 'admin_token'
        }
      });

      await store.dispatch(actions.login('admin', 'password'));

      store.getActions().should.deep.equal([
        {
          data: {
            access: {
              token: {
                id: 'admin_token'
              }
            }
          },
          type: actionTypes.LOGIN_SUCCESS,
        }
      ]);
    });
  });

  describe('logout() ', () => {
    it('should create LOGOUT', () => {
      const store = mockStore({});

      store.dispatch(actions.logout());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.LOGOUT,
        }
      ]);
    });
  });
});
