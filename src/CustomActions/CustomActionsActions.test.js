/* global it, describe */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';

import * as actionTypes from './CustomActionsActionTypes';
import * as dialogActionsTypes from './../Dialog/DialogActionTypes';
import * as successToasterActionsTypes from './../SuccessToaster/SuccessToasterActionTypes';
import * as actions from './CustomActionsActions';

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
        {},
      ));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.EXECUTE,
          data: {},
          url: '/url/id:/test',
          method: 'POST',
          responseFormat: undefined,
        }
      ]);
    });
  });

  describe('executeSuccess()', () => {
    it(`should dispatch ${successToasterActionsTypes.SUCCESS}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.executeSuccess({}, 'https://foo.bar',));

      store.getActions().should.deep.equal([
        {
          type: successToasterActionsTypes.SUCCESS,
          data: {},
          title: 'The Custom Action was Successful',
          url: 'https://foo.bar',
          responseFormat: undefined,
        }
      ]);
    });

    it(`should dispatch ${successToasterActionsTypes.SUCCESS} for html data`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.executeSuccess('<html><body></body></html>', 'https://foo.bar', 'html'));

      store.getActions().should.deep.equal([
        {
          type: successToasterActionsTypes.SUCCESS,
          data: '<html><body></body></html>',
          title: 'The Custom Action was Successful',
          url: 'https://foo.bar',
          responseFormat: 'html',
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
});
