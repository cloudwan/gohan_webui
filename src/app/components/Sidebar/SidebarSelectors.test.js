/* global it, describe */
import chai from 'chai';

import * as selectors from './SidebarSelectors';

chai.should();

describe('SidebarSelectors', () => {
  describe('getSidebarItems', () => {
    it('should return appropriate menu items', () => {
      selectors.getSidebarItems(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title',
                url: '/test1_url',
                metadata: {
                  type: 'test1_type'
                }
              },
              {
                id: 'test2',
                title: 'test2 title',
                url: '/test2_url',
                metadata: {
                  type: 'test2_type'
                }
              }
            ]
          },
          configReducer: {
            sidebar: [
              {
                title: 'test3',
                path: 'test3_url'
              }
            ]
          }
        }
      ).should.deep.equal(
        [
          {
            title: 'test1 title',
            path: '#/test1_url',
          },
          {
            title: 'test2 title',
            path: '#/test2_url',
          },
          {
            title: 'test3',
            path: '#/test3_url',
          }
        ]
      );
    });

    it('should return appropriate menu items, when schema is undefined', () => {
      selectors.getSidebarItems(
        {
          schemaReducer: {},
          configReducer: {
            sidebar: [
              {
                title: 'test3',
                path: 'test3_url'
              }
            ]
          }
        }
      ).should.deep.equal(
        [
          {
            title: 'test3',
            path: '#/test3_url',
          }
        ]
      );
    });

    it('should return appropriate menu items, when sidebar is undefined', () => {
      selectors.getSidebarItems(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title',
                url: '/test1_url',
                metadata: {
                  type: 'test1_type'
                }
              },
              {
                id: 'test2',
                title: 'test2 title',
                url: '/test2_url',
                metadata: {
                  type: 'test2_type'
                }
              }
            ]
          },
          configReducer: {}
        }
      ).should.deep.equal(
        [
          {
            title: 'test1 title',
            path: '#/test1_url',
          },
          {
            title: 'test2 title',
            path: '#/test2_url',
          }
        ]
      );
    });

    it('should return appropriate menu items, when schema isn\'t array', () => {
      selectors.getSidebarItems(
        {
          schemaReducer: {
            schema: {}
          },
          configReducer: {
            sidebar: [
              {
                title: 'test3',
                path: 'test3_url'
              }
            ]
          }
        }
      ).should.deep.equal(
        [
          {
            title: 'test3',
            path: '#/test3_url',
          }
        ]
      );
    });

    it('should return appropriate menu items, when sidebar isn\'t array', () => {
      selectors.getSidebarItems(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title',
                url: '/test1_url',
                metadata: {
                  type: 'test1_type'
                }
              },
              {
                id: 'test2',
                title: 'test2 title',
                url: '/test2_url',
                metadata: {
                  type: 'test2_type'
                }
              }
            ]
          },
          configReducer: {
            sidebar: {}
          }
        }
      ).should.deep.equal(
        [
          {
            title: 'test1 title',
            path: '#/test1_url',
          },
          {
            title: 'test2 title',
            path: '#/test2_url',
          }
        ]
      );
    });
  });
});
