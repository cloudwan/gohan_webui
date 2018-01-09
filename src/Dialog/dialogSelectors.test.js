/* global it, describe */
import chai from 'chai';

import * as selectors from './dialogSelectors';

chai.should();

describe('DialogSelectors', () => {
  describe('getLoadingState', () => {
    it('should return appropriate state of loading', () => {
      selectors.getLoadingState(
        {
          dialogReducer: {
            isLoading: true
          }
        }
      ).should.equal(true);
    });
  });

  describe('getSchema', () => {
    it('should return appropriate schema', () => {
      selectors.getSchema(
        {
          dialogReducer: {
            schema: {
              name: 'test'
            }
          }
        }
      ).should.deep.equal({
        name: 'test'
      });
    });
  });

  describe('isOpen', () => {
    it('should return appropriate state of dialog, if is hidden', () => {
      selectors.isOpen(
        {
          dialogReducer: {
            dialogs: {}
          }
        }
      ).should.equal(false);
    });

    it('should return appropriate state of dialog, if is open', () => {
      selectors.isOpen(
        {
          dialogReducer: {
            dialogs: {
              foo: true
            }
          }
        },
        'foo'
      ).should.equal(true);
    });
  });

  describe('getError', () => {
    it('should return appropriate state of loading', () => {
      selectors.getError(
        {
          dialogReducer: {
            errorMessage: 'Test error message.'
          }
        }
      ).should.equal('Test error message.');
    });
  });
});
