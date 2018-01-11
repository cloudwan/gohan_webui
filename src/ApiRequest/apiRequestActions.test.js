/* global it, describe */

import chai from 'chai';
import spies from 'chai-spies';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as actionTypes from './apiRequestActionTypes';
import * as actions from './apiRequestActions';

chai.use(spies);

chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ApiRequestActions', () => {
  describe('fetch()', () => {
    it(`should return ${actionTypes.FETCH} action for GET method`, () => {
      const store = mockStore({});

      store.dispatch(actions.fetch(
        'GET',
        '/test/url',
      ));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH,
          method: 'GET',
          url: '/test/url',
          body: undefined,
        }
      ]);
    });

    it(`should return ${actionTypes.FETCH} action for POST method`, () => {
      const store = mockStore({});

      store.dispatch(actions.fetch(
        'POST',
        '/test/url',
        {
          test: 'test'
        }
      ));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH,
          method: 'POST',
          url: '/test/url',
          body: {
            test: 'test'
          },
        }
      ]);
    });

    it(`should return ${actionTypes.FETCH} action for PUT method`, () => {
      const store = mockStore({});

      store.dispatch(actions.fetch(
        'PUT',
        '/test/url',
        {
          test: 'test'
        }
      ));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH,
          method: 'PUT',
          url: '/test/url',
          body: {
            test: 'test'
          },
        }
      ]);
    });
  });

  describe('fetchSuccess()', () => {
    it(`should return ${actionTypes.FETCH_SUCCESS} action`, () => {
      actions.fetchSuccess({
        name: 'test',
        id: 'test123',
      }).should.deep.equal({
        type: actionTypes.FETCH_SUCCESS,
        data: {
          name: 'test',
          id: 'test123',
        },
      });
    });
  });

  describe('fetchFailure', () => {
    it(`should return ${actionTypes.FETCH_FAILURE} action`, () => {
      actions.fetchFailure({
        message: 'Test error message',
      }).should.deep.equal({
        type: actionTypes.FETCH_FAILURE,
        error: {
          message: 'Test error message',
        },
      });
    });
  });

  describe('clearData()', () => {
    it(`should return ${actionTypes.CLEAR_DATA} action`, () => {
      const store = mockStore({});

      store.dispatch(actions.clearData());

      store.getActions().should.deep.equal([
        {type: actionTypes.CLEAR_DATA}
      ]);
    });
  });
});
