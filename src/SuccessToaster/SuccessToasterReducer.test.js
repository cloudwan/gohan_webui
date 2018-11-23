/* global it, describe */
import chai from 'chai';
import * as actionTypes from './SuccessToasterActionTypes';
import successToasterReducer from './SuccessToasterReducer';

chai.should();

describe('successToasterReducer ', () => {
  it('should return initial state', () => {
    successToasterReducer(undefined, {}).should.deep.equal({});
  });

  it(`should handle ${actionTypes.SUCCESS}`, () => {
    successToasterReducer(
      undefined, {
        type: actionTypes.SUCCESS,
        data: {
          foo: 'bar',
        },
        title: 'baz',
      }
    ).should.deep.equal({
      data: {
        foo: 'bar',
      },
      title: 'baz',
      format: undefined,
    });
  });

  it(`should handle ${actionTypes.DISMISS}`, () => {
    successToasterReducer({
      result: {}
      }, {
        type: actionTypes.DISMISS,
      }
    ).should.deep.equal({
      data: undefined,
      title: undefined,
      format: undefined,
    });
  });
});
