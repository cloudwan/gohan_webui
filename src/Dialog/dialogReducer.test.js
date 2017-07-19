/* global it, describe */
import chai from 'chai';
import * as actionTypes from './DialogActionTypes';
import dialogReducer from './dialogReducer';

chai.should();

describe('dialogReducer ', () => {

  it('should return initial state', () => {
    dialogReducer(undefined, {}).should.deep.equal({
      dialogs: {},
      errorMessage: '',
      isLoading: true,
      schema: undefined
    });
    dialogReducer({
      dialogs: {},
      errorMessage: '',
      isLoading: true,
      schema: undefined
    }, {}).should.deep.equal({
      dialogs: {},
      errorMessage: '',
      isLoading: true,
      schema: undefined
    });
  });

  it(`should handle ${actionTypes.OPEN}`, () => {
    dialogReducer(
      undefined, {
        type: actionTypes.OPEN,
        name: 'foo'
      }
    ).should.deep.equal({
      dialogs: {
        foo: true,
      },
      isLoading: true,
      errorMessage: '',
      schema: undefined
    });
  });

  it(`should handle ${actionTypes.CLOSE}`, () => {
    dialogReducer({
        dialogs: {
          foo: true,
        },
        isLoading: true,
        errorMessage: '',
        schema: undefined
      }, {
        type: actionTypes.CLOSE,
        name: 'foo'
      }
    ).should.deep.equal({
      dialogs: {},
      isLoading: true,
      errorMessage: '',
      schema: undefined
    });
  });

  it(`should handle ${actionTypes.ERROR}`, () => {
    dialogReducer({
        dialogs: {
          foo: true,
        },
        isLoading: true,
        errorMessage: '',
        schema: undefined
      }, {
        type: actionTypes.ERROR,
        message: 'Test error message.'
      }
    ).should.deep.equal({
      dialogs: {
        foo: true,
      },
      isLoading: true,
      errorMessage: 'Test error message.',
      schema: undefined
    });
  });
  it(`should handle ${actionTypes.CLEAR_ERROR}`, () => {
    dialogReducer({
        dialogs: {
          foo: true,
        },
        isLoading: true,
        errorMessage: 'Test error message.',
        schema: undefined
      }, {
        type: actionTypes.CLEAR_ERROR,
        message: 'Test error message.'
      }
    ).should.deep.equal({
      dialogs: {
        foo: true,
      },
      isLoading: true,
      errorMessage: '',
      schema: undefined
    });
  });

  it(`should handle ${actionTypes.PREPARE_SUCCESS}`, () => {
    dialogReducer(
      undefined, {
        type: actionTypes.PREPARE_SUCCESS,
        data: [
          {
            path: 'sample1'
          },
          {
            path: 'sample2'
          }
        ]
      }
    ).should.deep.equal({
      dialogs: {},
      isLoading: false,
      errorMessage: '',
      schema: [
        {
          path: 'sample1'
        },
        {
          path: 'sample2'
        }
      ]
    });
  });

  it('should handle CLEAR_DATA', () => {
    dialogReducer(
      undefined, {
        type: actionTypes.CLEAR_DATA
      }
    ).should.deep.equal({
      dialogs: {},
      isLoading: true,
      errorMessage: '',
      schema: undefined
    });
  });
});
