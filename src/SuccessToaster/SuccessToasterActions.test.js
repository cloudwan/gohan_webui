/* global it, describe */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';

import * as actionTypes from './SuccessToasterActionTypes';
import * as actions from './SuccessToasterActions';

chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('SuccessToasterActions ', () => {
  describe('dismiss()', () => {
    it(`should dispatch ${actionTypes.DISMISS}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.dismiss());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.DISMISS,
        }
      ]);
    });
  });
});
