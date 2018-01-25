/* global it, describe, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';

import * as actionTypes from './UiSchemaActionTypes';
import * as actions from './UiSchemaActions';

chai.use(sinonChai);

chai.should();

const _get = axios.get;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('UiSchemaActions ', () => {
  describe('fetchUiSchema ', () => {
    afterEach(() => {
      axios.get = _get;
    });

    it(`should create when ${actionTypes.FETCH_SUCCESS} fetching uiSchema has finished`, async () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      axios.get = sinon.spy(url => {
        url.should.equal('/locales/en-us/uiSchema.json');

        return Promise.resolve({
          data: [
            {path: 'sample1'},
            {path: 'sample2'}
          ]
        });
      });
      await store.dispatch(actions.fetchUiSchema());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH_SUCCESS,
          data: [
            {path: 'sample1'},
            {path: 'sample2'}
          ]
        }
      ]);
    });
  });
});
