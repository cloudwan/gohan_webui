/* global it, describe */
import chai from 'chai';
import * as selectors from './TableSelectors';

chai.should();

describe('TableSelectors ', () => {
  describe('getPageCount() ', () => {
    it('should return 1', () => {
      selectors.getPageCount({
        tableReducer: {
          totalCount: 10
        },
        configReducer: {
          pageLimit: 10
        }
      }).should.equal(1);
    });
    it('should return 0', () => {
      selectors.getPageCount({
        tableReducer: {
          totalCount: 0
        },
        configReducer: {
          pageLimit: 10
        }
      }).should.equal(0);
    });
    it('should return 2', () => {
      selectors.getPageCount({
        tableReducer: {
          totalCount: 10,
          limit: 5
        },
        configReducer: {
          pageLimit: 10
        }
      }).should.equal(2);
    });
  });


  describe('getActivePage() ', () => {
    it('should return 0', () => {
      selectors.getActivePage({
        tableReducer: {
          totalCount: 10,
          offset: 0
        },
        configReducer: {
          pageLimit: 10
        }
      }).should.equal(0);
    });

    it('should return 1', () => {
      selectors.getActivePage({
        tableReducer: {
          totalCount: 10,
          offset: 5
        },
        configReducer: {
          pageLimit: 5
        }
      }).should.equal(1);
    });
  });
});
