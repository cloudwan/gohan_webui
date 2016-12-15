/* global it, afterEach, describe, sessionStorage */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';

import * as actionTypes from './AuthActionTypes';
import * as actions from './AuthActions';

chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('AuthActions ', () => {
  afterEach(() => {
    sessionStorage.clear();
    sessionStorage.itemInsertionCallback = null;
  });
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
