/* global it, describe */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';

import * as actionTypes from './ConfigActionTypes';
import * as actions from './ConfigActions';

chai.use(spies);

chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ConfigActions ', () => {
  describe('fetch()', () => {
    it(`should dispatch ${actionTypes.FETCH} action`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.fetch());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH,
        }
      ]);
    });
  });

  describe('fetchSuccess()', () => {
    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.fetchSuccess({
        configProp1: 'foo',
        configProp2: 'bar',
      }));

      store.getActions().should.deep.equal([{
        type: actionTypes.FETCH_SUCCESS,
        data: {
          configProp1: 'foo',
          configProp2: 'bar',
        },
      }]);
    });
  });

  describe('fetchFailure()', () => {
    it(`should dispatch ${actionTypes.FETCH_FAILURE} action`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.fetchFailure('Unknown error!'));

      store.getActions().should.deep.equal([{
        type: actionTypes.FETCH_FAILURE,
        error: 'Unknown error!',
      }]);
    });
  });
});
