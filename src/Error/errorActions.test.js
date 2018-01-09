/* global it, describe */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';

import * as actionTypes from './errorActionTypes';
import * as actions from './errorActions';

chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ErrorActions ', () => {
  it('should creates RESET_ERROR_MESSAGE', () => {
    const store = mockStore({});

    store.dispatch(actions.resetErrorMessage());

    store.getActions().should.deep.equal([
      {
        type: actionTypes.RESET_ERROR_MESSAGE
      }
    ]);
  });
});
