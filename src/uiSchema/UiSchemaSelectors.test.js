/* global it, describe */
import chai from 'chai';

import * as selectors from './UiSchemaSelectors';

chai.should();

describe('UiSchemaSelectors', () => {

  describe('getUiSchema', () => {
    it('should return appropriate schema', () => {
      selectors.getUiSchema(
        {
          uiSchemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title'
              },
              {
                id: 'test2',
                title: 'test2 title'
              }
            ]
          }
        },
        'test1').should.deep.equal(
        {
          id: 'test1',
          title: 'test1 title'
        }
      );
    });
  });
});
