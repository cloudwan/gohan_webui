/* global it, describe */
import chai from 'chai';

import * as selectors from './locationSelectors';

chai.should();

describe('LocationSelectors', () => {
  describe('getPathname', () => {
    it('should return appropriate path name', () => {
      selectors.getPathname(
        {
          locationReducer: {
            pathname: '#/test/path'
          }
        }
      ).should.deep.equal('#/test/path');
    });
  });
});
