/* global it, describe */
import chai from 'chai';

import * as selectors from './customActionsSelectors';

chai.should();

describe('DetailSelectors', () => {
  describe('getActionResult', () => {
    it('should return appropriate string', () => {
      selectors.getActionResult(
        {
          customActionReducer: {
            result: {test: 1}
          }
        }
      ).should.deep.equal({test: 1});
    });
  });
});
