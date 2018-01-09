/* global it, describe */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';

import * as actionTypes from './customActionsActionTypes';
import * as dialogActionsTypes from './../Dialog/dialogActionTypes';
import * as actions from './customActionsActions';
chai.use(spies);

chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('CustomActionsActions ', () => {
  describe('execute()', () => {
    it(`should dispatch ${actionTypes.EXECUTE}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.execute(
        {
          method: 'POST',
          path: 'id:/test'
        },
        '/url/',
        'foo',
        {}
      ));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.EXECUTE,
          data: {},
          url: '/url/id:/test',
          method: 'POST'
        }
      ]);
    });
  });

  describe('executeSuccess()', () => {
    it(`should dispatch ${actionTypes.EXECUTE_SUCCESS}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.executeSuccess({}));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.EXECUTE_SUCCESS,
          data: {},
        }
      ]);
    });
  });

  describe('executeFailure()', () => {
    it(`should dispatch ${actionTypes.EXECUTE_FAILURE}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.executeFailure('error'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.EXECUTE_FAILURE,
          error: 'error',
        }
      ]);
    });

    it(`should dispatch ${dialogActionsTypes.ERROR}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.executeFailure('error', true));

      store.getActions().should.deep.equal([
        {
          type: dialogActionsTypes.ERROR,
          message: 'error',
        }
      ]);
    });
  });

  describe('clearResponse()', () => {
    it(`should dispatch ${actionTypes.CLEAR_RESPONSE}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.clearResponse());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CLEAR_RESPONSE,
        }
      ]);
    });
  });
});
