/* global it, describe */
import chai from 'chai';

import * as selectors from './DetailSelectors';

chai.should();

describe('DetailSelectors', () => {
  describe('checkLoading', () => {
    it('should return appropriate state of loading', () => {
      selectors.checkLoading(
        {
          detailReducer: {
            isLoading: true
          }
        }
      ).should.equal(true);
    });
  });

  describe('getData', () => {
    it('should return appropriate data', () => {
      selectors.getData(
        {
          detailReducer: {
            data: {
              id: '123Schema1',
              prop1: '123Prop1',
              schemaId2: {
                parents: {
                  schemaId3_id: '123Schema3', // eslint-disable-line camelcase
                  schemaId4_id: '123Schema4', // eslint-disable-line camelcase
                }
              },
              prop2: '123prop2',
              relationProp4: {
                id: '123prop2',
                name: 'Relation Prop 4',
              }
            }
          },
          schemaReducer: {
            data: [
              {
                id: 'schemaId1',
                plural: 'schemaId1s',
                schema: {
                  properties: {
                    prop1: {
                      relation: 'schemaId2'
                    },
                    prop2: {
                      relation: 'schemaId4',
                      relation_property: 'relationProp4' // eslint-disable-line camelcase
                    }
                  }
                }
              },
              {
                id: 'schemaId2',
                plural: 'schemaId2s',
                parent: 'schemaId3',
              },
              {
                id: 'schemaId3',
                plural: 'schemaId3s',
                parent: 'schemaId4',
              },
              {
                id: 'schemaId4',
                plural: 'schemaId4s',
                prefix: 'v0.1',
                parent: '',
              },
            ]
          }
        },
        'schemaId1',
        {schemaId1_id: '123Schema1'} // eslint-disable-line camelcase
      ).should.deep.equal({
        id: '123Schema1',
        prop1: '123Prop1',
        schemaId2: {
          url: 'v0.1/schemaId4s/123Schema4/schemaId3s/123Schema3/schemaId2s/123Prop1',
          parents: {
            schemaId3_id: '123Schema3', // eslint-disable-line camelcase
            schemaId4_id: '123Schema4', // eslint-disable-line camelcase
          }
        },
        prop2: '123prop2',
        relationProp4: {
          id: '123prop2',
          name: 'Relation Prop 4',
          url: 'v0.1/schemaId4s/123prop2',
        }
      });
    });

    it('should return empty object', () => {
      selectors.getData(
        {
          detailReducer: {},
          schemaReducer: {},
        }
      ).should.deep.equal({});
    });
  });
});
