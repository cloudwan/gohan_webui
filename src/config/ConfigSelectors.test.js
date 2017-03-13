/* global it, describe */
import chai from 'chai';

import * as selectors from './ConfigSelectors';

chai.should();

describe('ConfigSelectors', () => {
  describe('getSidebar', () => {
    it('should return appropriate menu items', () => {
      selectors.getSidebar(
        {
          configReducer: {
            sidebar: [
              {
                title: 'sampleTest',
                path: 'foo/bar/baz'
              }
            ]
          }
        }
      ).should.deep.equal([
        {
          title: 'sampleTest',
          path: '#/foo/bar/baz'
        }
      ]);
    });

    it('should return empty menu items array', () => {
      selectors.getSidebar({
        schemaReducer: {},
        configReducer: {},
      }).should.deep.equal([]);
    });
  });
});
