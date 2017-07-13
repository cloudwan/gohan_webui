/* global it, describe */
import chai from 'chai';

import * as selectors from './DetailSelectors';

chai.should();

describe('DetailSelectors', () => {
  describe('checkLoading', () => {
    it('should return appropriate state of loading', () => {
      selectors.checkLoading(
        {
          detailReducer: {
            isLoading: true
          }
        }
      ).should.equal(true);
    });
  });

  describe('getData', () => {
    it('should return appropriate data', () => {
      selectors.getData(
        {
          detailReducer: {
            data: {
              name: 'test'
            }
          }
        }
      ).should.deep.equal({
        name: 'test'
      });
    });

    it('should return empty object', () => {
      selectors.getData(
        {
          detailReducer: {
          }
        }
      ).should.deep.equal({});
    });
  });
});
