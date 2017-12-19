/* global it, describe */

import chai from 'chai';

import * as selectors from './ApiRequestSelectors';

chai.should();

describe('ApiRequestSelectors', () => {
  describe('checkLoading()', () => {
    it('should return appropriate state (false) of loading', () => {
      selectors.checkLoading({
        apiRequestReducer: {
          isLoading: false,
        }
      }).should.equal(false);
    });

    it('should return appropriate state (true) of loading', () => {
      selectors.checkLoading({
        apiRequestReducer: {
          isLoading: true,
        }
      }).should.equal(true);
    });
  });

  describe('getApiResponse()', () => {
    it('should return appropriate empty object', () => {
      selectors.getApiResponse({
        apiRequestReducer: {
          response: {},
        }
      }).should.deep.equal({});
    });

    it('should return appropriate object', () => {
      selectors.getApiResponse({
        apiRequestReducer: {
          response: {
            testObject: {
              id: 123,
              name: 'test',
            }
          },
        }
      }).should.deep.equal({
        testObject: {
          id: 123,
          name: 'test',
        }
      });
    });
  });
});
