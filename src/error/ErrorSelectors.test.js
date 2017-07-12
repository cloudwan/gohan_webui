/* global it, describe */
import chai from 'chai';

import * as selectors from './ErrorSelectors';

chai.should();

describe('ErrorSelectors', () => {
  describe('getError', () => {
    it('should return appropriate error message', () => {
      selectors.getError(
        {
          errorReducer: 'Test error'
        }
      ).should.deep.equal('Test error');
    });
  });
});
