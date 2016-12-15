/* global it, describe, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';
import axios from 'axios';

import * as actionTypes from './DetailActionTypes';
import * as actions from './DetailActions';

chai.use(spies);

chai.should();

const _get = axios.get;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('DetailActions', () => {
  afterEach(() => {
    axios.get = _get;
  });

  it('should call dispatch with CANCEL_POLLING_DATA when cancelPollData is called', () => {
    const returnFunc = actions.cancelPollData();
    const dispatcherFunc = chai.spy();

    returnFunc(dispatcherFunc);

    dispatcherFunc.should.have.been.called.with({type: actionTypes.CANCEL_POLLING_DATA});
  });

  it('should call dispatch once when cancelPollData is called', () => {
    const returnFunc = actions.cancelPollData();
    const dispatcherFunc = chai.spy();

    returnFunc(dispatcherFunc);

    dispatcherFunc.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });

  it('should clearTimeout once when cancelPollData is called', () => {
    const returnFunc = actions.cancelPollData();
    const timeoutCheck = chai.spy();

    clearTimeout = timeoutCheck;
    const dispatcherFunc = chai.spy();

    returnFunc(dispatcherFunc);

    timeoutCheck.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });
});
