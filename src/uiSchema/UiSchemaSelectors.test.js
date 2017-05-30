/* global it, describe */
import chai from 'chai';

import * as selectors from './UiSchemaSelectors';

const should = chai.should();

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

  describe('getUiSchemaProperties', () => {
    it('should return appropriate schema', () => {
      selectors.getUiSchemaProperties(
        {
          uiSchemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title',
                properties: {
                  name: {
                    type: 'string'
                  }
                }
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
          name: {
            type: 'string'
          }
        }
      );

      should.not.exist(selectors.getUiSchemaProperties(
        {
          uiSchemaReducer: {
            data: []
          }
        },
        'test1')
      );
    });
  });
});
