/* global it, describe */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';

import * as actionTypes from './DetailActionTypes';
import * as actions from './DetailActions';

chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('DetailActions ', () => {
  describe('fetch()', () => {
    it(`should dispatch ${actionTypes.FETCH} action`, () => {
      const schemaId = 'test';
      const params = {param: 'test'};

      actions.fetch(schemaId, params)().should.deep.equal({
        type: actionTypes.FETCH,
        schemaId,
        params
      });
    });
  });

  describe('fetchSuccess()', () => {
    it(`should return ${actionTypes.FETCH_SUCCESS} action`, () => {
     actions.fetchSuccess({name: 'name'}).should.deep.equal({
       type: actionTypes.FETCH_SUCCESS,
       data: {
         name: 'name'
       },
     });
    });
  });

  describe('fetchError()', () => {
    it(`should return ${actionTypes.FETCH_FAILURE} action`, () => {
      actions.fetchError('Error message').should.deep.equal({
        type: actionTypes.FETCH_FAILURE,
        error: 'Error message',
      });
    });
  });

  describe('fetchCancelled()', () => {
    it(`should return ${actionTypes.FETCH_CANCELLED} action`, () => {
      actions.fetchCancelled().should.deep.equal({
        type: actionTypes.FETCH_CANCELLED,
      });
    });
  });

  describe('clearData()', () => {
    it(`should dispatch ${actionTypes.CLEAR_DATA} and ${actionTypes.FETCH_CANCELLED} actions`, () => {
      const store = mockStore({});

      store.dispatch(actions.clearData());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH_CANCELLED,
        },
        {
          type: actionTypes.CLEAR_DATA,
        },
      ]);
    });
  });

  describe('updateSuccess()', () => {
    it(`should dispatch ${actionTypes.FETCH} action`, () => {
      const store = mockStore({});
      const schemaId = 'test';
      const params = {param: 'test'};

      store.dispatch(actions.updateSuccess(schemaId, params));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.UPDATE_SUCCESS,
          schemaId,
          params
        },
      ]);
    });
  });

  describe('updateError()', () => {
    it(`should dispatch ${actionTypes.UPDATE_FAILURE} action`, () => {
      const store = mockStore({});

      store.dispatch(actions.updateError('Error message'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.UPDATE_FAILURE,
        },
      ]);
    });
  });

  describe('update()', () => {
    it(`should dispatch ${actionTypes.DELETE} action`, () => {
      const schemaId = 'test';
      const params = {param: 'test'};

      actions.update(schemaId, params)({name: 'test'}).should.deep.equal({
        type: actionTypes.UPDATE,
        schemaId,
        params,
        data: {
          name: 'test'
        }
      });
    });
  });

  describe('removeSuccess()', () => {
    it(`should dispatch ${actionTypes.DELETE_SUCCESS} and ${actionTypes.FETCH_CANCELLED} actions`, () => {
      const store = mockStore({});
      const url = 'test/url';

      store.dispatch(actions.removeSuccess(url));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.DELETE_SUCCESS,
        },
      ]);
    });
  });

  describe('remove()', () => {
    it(`should dispatch ${actionTypes.DELETE} action`, () => {
      const schemaId = 'test';
      const params = {param: 'test'};

      actions.remove(schemaId, params)().should.deep.equal({
        type: actionTypes.DELETE,
        schemaId,
        params
      });
    });
  });
});
