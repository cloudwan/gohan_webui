/* global it, describe */
import chai from 'chai';

import * as selectors from './CustomActionsSelectors';

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
      ).should.equal('{\n  "test": 1\n}');
    });

    it('should return empty string', () => {
      selectors.getActionResult(
        {
          customActionReducer: {
            result: undefined
          }
        }
      ).should.equal('');
    });
  });
});
