/* global it, describe */
import chai from 'chai';
import * as actionTypes from './breadcrumbsActionTypes';
import breadcrumbReducer from './breadcrumbsReducer';

chai.should();

describe('breadcrumbReducer ', () => {
  it('should return initial state', () => {
    breadcrumbReducer(undefined, {}).should.deep.equal({
      data: [],
    });
  });

  it(`should handle ${actionTypes.UPDATE_FULFILLED} action`, () => {
    breadcrumbReducer(undefined, {
      type: actionTypes.UPDATE_FULFILLED,
      data: [
        {
          title: 'testItem1',
          url: '/testUrl1',
        },
        {
          title: 'testItem2',
          url: '/testUrl2',
        },
      ]
    }).should.deep.equal({
      data: [
        {
          title: 'testItem1',
          url: '/testUrl1',
        },
        {
          title: 'testItem2',
          url: '/testUrl2',
        },
      ],
    });
  });
});
