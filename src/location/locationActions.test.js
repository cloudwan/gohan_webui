/* global it, describe */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';

import * as actionTypes from './locationActionTypes';
import * as actions from './locationActions';

chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('LocationActions ', () => {
  it('should creates LOCATION_CHANGE', () => {
    const store = mockStore({});

    actions.updateLocation(store)();

    store.getActions().should.deep.equal([
      {
        type: actionTypes.LOCATION_CHANGE,
        payload: '/'
      }
    ]);

    store.clearActions();
    actions.updateLocation(store)('/sample/path');

    store.getActions().should.deep.equal([
      {
        type: actionTypes.LOCATION_CHANGE,
        payload: '/sample/path'
      }
    ]);
  });
});
