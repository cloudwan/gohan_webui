/* global it, describe */
import chai from 'chai';

import * as actionTypes from './tableActionTypes';
import * as actions from './tableActions';

chai.should();

describe('TableActions ', () => {
  describe('fetch()', () => {
    it('should return function.', () => {
      actions.fetch().should.be.a('function');
    });
    describe('returned function ', () => {
      it(`should return ${actionTypes.FETCH} action.`, () => {
        const schemaId = 'foo';
        const params = {};
        const options = {};

        actions.fetch(schemaId, params)(options).should.deep.equal({
          type: actionTypes.FETCH,
          schemaId,
          params,
          options
        });
      });
    });
  });

  describe('fetchSuccess()', () => {
    it(`should return ${actionTypes.FETCH_SUCCESS} action with data.`, () => {
      const sampleData = {
        foo: {}
      };

      actions.fetchSuccess(sampleData).should.deep.equal({
        type: actionTypes.FETCH_SUCCESS,
        data: sampleData
      });
    });
  });

  describe('fetchFailure()', () => {
    it(`should return ${actionTypes.FETCH_SUCCESS} action with data.`, () => {
      const errorMsg = 'Unknown error';

      actions.fetchFailure(errorMsg).should.deep.equal({
        type: actionTypes.FETCH_FAILURE,
        error: errorMsg
      });
    });
  });

  describe('cancelFetch()', () => {
    it(`should return ${actionTypes.FETCH_CANCELLED} action.`, () => {
      actions.cancelFetch('TEST')().should.deep.equal({
        type: actionTypes.FETCH_CANCELLED,
        schemaId: 'TEST'
      });
    });
  });

  describe('createSuccess()', () => {
    it(`should return ${actionTypes.CREATE_SUCCESS} action.`, () => {
      actions.createSuccess().should.deep.equal({
        type: actionTypes.CREATE_SUCCESS
      });
    });
  });

  describe('createFailure()', () => {
    it('should return DIALOG_ERROR action.', () => {
      actions.createFailure('error').should.deep.equal({
        type: 'DIALOG_ERROR',
        message: 'error'
      });
    });
  });

  describe('create()', () => {
    it(`should return ${actionTypes.CREATE} action.`, () => {
      actions.create('test', {})({name: 'test'}).should.deep.equal({
        type: actionTypes.CREATE,
        schemaId: 'test',
        params: {},
        data: {name: 'test'}
      });
    });
  });

  describe('update()', () => {
    it(`should return ${actionTypes.UPDATE} action.`, () => {
      actions.update('test', {})({name: 'test'}, 'bad').should.deep.equal({
        type: actionTypes.UPDATE,
        schemaId: 'test',
        params: {},
        data: {name: 'test'},
        id: 'bad'
      });
    });
  });


  describe('updateSuccess()', () => {
    it(`should return ${actionTypes.UPDATE_SUCCESS} action.`, () => {
      actions.updateSuccess().should.deep.equal({
        type: actionTypes.UPDATE_SUCCESS
      });
    });
  });

  describe('updateFailure()', () => {
    it('should return DIALOG_ERROR action.', () => {
      actions.updateFailure('error').should.deep.equal({
        type: 'DIALOG_ERROR',
        message: 'error'
      });
    });
  });

  describe('purge()', () => {
    it(`should return ${actionTypes.PURGE} action.`, () => {
      actions.purge('test', {})('bad').should.deep.equal({
        type: actionTypes.PURGE,
        schemaId: 'test',
        params: {},
        id: 'bad'
      });
    });
  });


  describe('purgeSuccess()', () => {
    it(`should return ${actionTypes.PURGE_SUCCESS} action.`, () => {
      actions.purgeSuccess().should.deep.equal({
        type: actionTypes.PURGE_SUCCESS
      });
    });
  });

  describe('purgeFailure()', () => {
    it(`should return ${actionTypes.PURGE_FAILURE} action.`, () => {
      actions.purgeFailure('error').should.deep.equal({
        type: actionTypes.PURGE_FAILURE,
        error: 'error'
      });
    });
  });

  describe('clear()', () => {
    it(`should return ${actionTypes.CLEAR_DATA} action.`, () => {
      actions.clear('test')().should.deep.equal({
        type: actionTypes.CLEAR_DATA,
        data: 'test'
      });
    });
  });
});
