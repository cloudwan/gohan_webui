/* global it, describe */
import chai from 'chai';

import * as selectors from './SidebarSelectors';

chai.should();

describe('SidebarSelectors', () => {
  describe('getSidebarCategories', () => {
    it('should return empty favorites and others for undefined data and sidebar', () => {
      selectors.getSidebarCategories({
        configReducer: {},
        schemaReducer: {},
      }).should.deep.equal([
        {
          title: 'Favorites',
          items: [],
        },
        {
          title: 'Others',
          items: [],
        }
      ]);
    });

    it('should return appropriate menu items', () => {
      selectors.getSidebarCategories({
        configReducer: {
          sidebar: [
            {
              id: 'test3_id',
              title: 'Test3 title',
              path: 'test3_url',
            }
          ],
          sidebarCategories: [
            {
              name: 'Test1 Category',
              id: 'test1_category_id',
              items: [
                'test1_id',
                'test3_id',
              ],
            },
          ],
          sidebarFavorites: [
            'test1_id',
          ]
        },
        schemaReducer: {
          data: [
            {
              id: 'test1_id',
              title: 'Test1 title',
              url: '/test1_url',
              metadata: {
                type: 'test1_type'
              }
            },
            {
              id: 'test2_id',
              title: 'Test2 title',
              url: '/test2_url',
              metadata: {
                type: 'test2_type'
              }
            }
          ]
        },
      }).should.deep.equal([
        {
          title: 'Favorites',
          items: [
            {
              title: 'Test1 title',
              path: '#/test1_url'
            }
          ]
        },
        {
          title: 'Test1 Category',
          items: [
            {
              title: 'Test1 title',
              path: '#/test1_url',
            },
            {
              title: 'Test3 title',
              path: '#/test3_url',
            },
          ],
        },
        {
          title: 'Others',
          items: [
            {
              title: 'Test2 title',
              path: '#/test2_url',
            }
          ]
        }
      ]);
    });

    it('should return appropriate menu items, when schema is undefined', () => {
      selectors.getSidebarCategories({
        schemaReducer: {},
        configReducer: {
          sidebar: [
            {
              id: 'test3_id',
              title: 'Test3 title',
              path: 'test3_url',
            }
          ],
          sidebarCategories: [
            {
              name: 'Test1 Category',
              id: 'test1_category_id',
              items: [
                'test1_id',
                'test3_id',
              ],
            },
          ],
          sidebarFavorites: [
            'test3_id',
          ]
        },
      }).should.deep.equal([
        {
          title: 'Favorites',
          items: [
            {
              title: 'Test3 title',
              path: '#/test3_url'
            },
          ]
        },
        {
          title: 'Test1 Category',
          items: [
            {
              title: 'Test3 title',
              path: '#/test3_url',
            },
          ]
        },
        {
          title: 'Others',
          items: [],
        }
      ]);
    });

    it('should return appropriate menu items, when schema is undefined and items don\'t have categories', () => {
      selectors.getSidebarCategories({
        schemaReducer: {},
        configReducer: {
          sidebar: [
            {
              id: 'test2_id',
              title: 'Test2 title',
              path: 'test2_url',
            }
          ],
          sidebarCategories: [
            {
              name: 'Test1 Category',
              id: 'test1_category_id',
              items: [
                'test1_id',
                'test3_id',
              ],
            },
          ],
          sidebarFavorites: [
            'test1_id',
          ]
        },
      }).should.deep.equal([
        {
          title: 'Favorites',
          items: [],
        },
        {
          title: 'Test1 Category',
          items: []
        },
        {
          title: 'Others',
          items: [
            {
              title: 'Test2 title',
              path: '#/test2_url',
            },
          ],
        }
      ]);
    });


    it('should return appropriate menu items, when sidebar is undefined', () => {
      selectors.getSidebarCategories({
        configReducer: {
          sidebarCategories: [
            {
              name: 'Test1 Category',
              id: 'test1_category_id',
              items: [
                'test1_id',
                'test3_id',
              ],
            },
          ],
          sidebarFavorites: [
            'test3_id',
          ],
        },
        schemaReducer: {
          data: [
            {
              id: 'test1_id',
              title: 'Test1 title',
              url: '/test1_url',
              metadata: {
                type: 'test1_type'
              }
            },
            {
              id: 'test2_id',
              title: 'Test2 title',
              url: '/test2_url',
              metadata: {
                type: 'test2_type'
              }
            }
          ]
        },
      }).should.deep.equal([
        {
          title: 'Favorites',
          items: [],
        },
        {
          title: 'Test1 Category',
          items: [
            {
              title: 'Test1 title',
              path: '#/test1_url',
            }
          ]
        },
        {
          title: 'Others',
          items: [
            {
              title: 'Test2 title',
              path: '#/test2_url',
            }
          ]
        },
      ]);
    });

    it('should return appropriate menu items, when schema isn\'t array', () => {
      selectors.getSidebarCategories({
        configReducer: {
          sidebar: [
            {
              id: 'test1_id',
              title: 'Test1 title',
              path: 'test1_url',
            }
          ],
          sidebarCategories: [
            {
              name: 'Test1 Category',
              id: 'test1_category_id',
              items: [
                'test1_id',
              ],
            },
          ],
        },
        schemaReducer: {
          data: {},
        },
      }).should.deep.equal([
        {
          title: 'Favorites',
          items: [],
        },
        {
          title: 'Test1 Category',
          items: [
            {
              title: 'Test1 title',
              path: '#/test1_url',
            }
          ]
        },
        {
          title: 'Others',
          items: [],
        }
      ]);
    });

    it('should return appropriate menu items, when sidebar isn\'t array', () => {
      selectors.getSidebarCategories({
        configReducer: {
          sidebar: {},
          sidebarCategories: [
            {
              name: 'Test1 Category',
              id: 'test1_category_id',
              items: [
                'test1_id',
              ],
            },
          ],
          sidebarFavorites: [
            'test3_id',
          ]
        },
        schemaReducer: {
          data: [
            {
              id: 'test1_id',
              title: 'Test1 title',
              url: '/test1_url',
              metadata: {
                type: 'test1_type'
              }
            },
            {
              id: 'test2_id',
              title: 'Test2 title',
              url: '/test2_url',
              metadata: {
                type: 'test2_type'
              }
            }
          ]
        },
      }).should.deep.equal([
        {
          title: 'Favorites',
          items: [],
        },
        {
          title: 'Test1 Category',
          items: [
            {
              title: 'Test1 title',
              path: '#/test1_url',
            }
          ]
        },
        {
          title: 'Others',
          items: [
            {
              title: 'Test2 title',
              path: '#/test2_url',
            }
          ],
        },
      ]);
    });
  });
});
