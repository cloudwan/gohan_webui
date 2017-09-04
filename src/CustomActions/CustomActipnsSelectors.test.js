/* global it, describe */
import chai from 'chai';

import * as selectors from './CustomActionsSelectors';

chai.should();

describe('DetailSelectors', () => {
  describe('getActionResultYAML', () => {
    it('should return appropriate string', () => {
      selectors.getActionResultYAML(
        {
          customActionReducer: {
            result: {test: 1}
          }
        }
      ).should.equal('test: 1\n');
    });

    it('should return empty string', () => {
      selectors.getActionResultYAML(
        {
          customActionReducer: {
            result: undefined
          }
        }
      ).should.equal('');
    });
  });
});
