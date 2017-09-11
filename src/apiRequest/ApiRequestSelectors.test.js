/* global it, describe */

import chai from 'chai';
import jsyaml from 'js-yaml';

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
    it('should return appropriate yaml for undefined', () => {
      selectors.getApiResponse({
        apiRequestReducer: {
          response: undefined,
        }
      }).should.equal(jsyaml.safeDump(undefined, {skipInvalid: true}));
    });

    it('should return appropriate yaml for empty object', () => {
      selectors.getApiResponse({
        apiRequestReducer: {
          response: {},
        }
      }).should.equal(jsyaml.safeDump({}, {skipInvalid: true}));
    });

    it('should return appropriate yaml', () => {
      selectors.getApiResponse({
        apiRequestReducer: {
          response: {
            testObject: {
              id: 123,
              name: 'test',
            }
          },
        }
      }).should.equal(jsyaml.safeDump({
        testObject: {
          id: 123,
          name: 'test',
        }
      }, {skipInvalid: true}));
    });
  });
});
