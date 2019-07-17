/* global it, describe, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import axios from 'axios';

import * as actionTypes from './DialogActionTypes';
import * as actions from './DialogActions';

chai.use(sinonChai);

chai.should();

const _get = axios.get;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('DialogActions ', () => {
  afterEach(() => {
    axios.get = _get;
  });

  describe('openDialog', () => {
    it(`should create ${actionTypes.OPEN}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.openDialog('foo')({id: 'sampleId'}));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.OPEN,
          name: 'foo',
          additionalProps: {id: 'sampleId'}
        }
      ]);
    });
  });

  describe('closeDialog', () => {
    it(`should create ${actionTypes.CLOSE}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.closeDialog('foo')());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CLOSE,
          name: 'foo',
        }
      ]);
    });
  });

  describe('clearError', () => {
    it(`should create ${actionTypes.CLEAR_ERROR}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.clearError());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CLEAR_ERROR,
        }
      ]);
    });
  });

  describe('showError', () => {
    it(`should create ${actionTypes.CLEAR_ERROR}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.showError('Test error message'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.ERROR,
          message: 'Test error message',
        }
      ]);
    });
  });
});
