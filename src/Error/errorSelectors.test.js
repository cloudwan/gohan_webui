/* global it, describe */
import chai from 'chai';

import * as selectors from './errorSelectors';

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
