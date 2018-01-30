/* global it, describe */
import chai from 'chai';

import * as selectors from './ConfigSelectors';

chai.should();

describe('ConfigSelectors', () => {
  describe('getSidebar', () => {
    it('should return appropriate menu items', () => {
      selectors.getSidebar(
        {
          configReducer: {
            sidebar: [
              {
                title: 'sampleTest',
                path: 'foo/bar/baz'
              }
            ]
          }
        }
      ).should.deep.equal([
        {
          title: 'sampleTest',
          path: '#/foo/bar/baz'
        }
      ]);
    });

    it('should return empty menu items array', () => {
      selectors.getSidebar({
        schemaReducer: {},
        configReducer: {},
      }).should.deep.equal([]);
    });
  });

  describe('isPolling', () => {
    it('should return false.', () => {
      selectors.isPolling({
        configReducer: {},
      }).should.deep.equal(false);
    });

    it('should return true.', () => {
      selectors.isPolling({
        configReducer: {
          polling: true
        },
      }).should.deep.equal(true);
    });
  });

  describe('getPollingInterval', () => {
    it('should return setted polling interval.', () => {
      selectors.getPollingInterval({
        configReducer: {
          pollingInterval: 840455
        }
      }).should.equal(840455);
    });

    it('should return 32 bit int when polling interval isn\'t setted.', () => {
      selectors.getPollingInterval({
        configReducer: {}
      }).should.equal(2147483647);
    });
  });

  describe('getGohanUrl', () => {
    it('should return setted gohanURL.', () => {
      selectors.getGohanUrl({
        configReducer: {
          gohan: {
            url: 'http://gohan.io'
          }
        }
      }).should.equal('http://gohan.io');
    });
  });

  describe('getPageLimit', () => {
    it('should return setted page limit.', () => {
      selectors.getPageLimit({
        configReducer: {
          pageLimit: 5739
        }
      }).should.equal(5739);
    });

    it('should return 0 when polling interval isn\'t setted.', () => {
      selectors.getPageLimit({
        configReducer: {}
      }).should.equal(0);
    });
  });

  describe('getDefaultSortKey', () => {
    it('should return setted default sort key.', () => {
      selectors.getDefaultSortKey({
        configReducer: {
          tableDefaultSortKey: 'name'
        }
      }).should.equal('name');
    });
  });

  describe('getDefaultSortOrder', () => {
    it('should return setted page limit.', () => {
      selectors.getDefaultSortOrder({
        configReducer: {
          tableDefaultSortOrder: 'asc'
        }
      }).should.equal('asc');
    });
  });

  describe('getFollowableRelationsState', () => {
    it('should return false.', () => {
      selectors.getFollowableRelationsState({
        configReducer: {},
      }).should.deep.equal(false);
    });

    it('should return true.', () => {
      selectors.getFollowableRelationsState({
        configReducer: {
          followableRelations: true
        },
      }).should.deep.equal(true);
    });
  });
});
