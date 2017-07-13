/* global it, describe */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';

import * as actionTypes from './DetailActionTypes';
import * as actions from './DetailActions';

chai.use(spies);

chai.should();


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('DetailActions ', () => {
  describe('fetch()', () => {
    it(`should dispatch ${actionTypes.FETCH} action`, () => {
      const store = mockStore({});
      const url = 'test/url';

      store.dispatch(actions.fetch(url)());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH,
          url,
        },
      ]);
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
      const url = 'test/url';

      store.dispatch(actions.updateSuccess(url));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH,
          url,
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
          error: 'Error message'
        },
      ]);
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
        {
          type: actionTypes.FETCH_CANCELLED,
        },
      ]);
    });
  });
});
