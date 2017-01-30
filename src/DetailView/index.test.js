/* global it, describe */
import chai from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {onDetailEnter} from './index';

chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('DetailView index', () => {
  describe('onDetailEnter() ', () => {
    it('should inject reducer', () => {
      const storeObject = {};
      const store = mockStore(storeObject);
      store.asyncReducers = {};

      onDetailEnter(store);

      store.asyncReducers['detailReducer'].should.not.equal(undefined);
    });
  });
});
