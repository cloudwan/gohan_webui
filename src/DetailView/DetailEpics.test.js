/* global it, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import * as actionTypes from './DetailActionTypes';
import {
  fetch,
  fetchWithParents,
} from './DetailEpics';

chai.should();

describe('DetailEpics', () => {
  const mockStore = configureMockStore();
  const store = mockStore(
    {
      schemaReducer: {
        data: [
          {
            id: 'testSchemaId1',
            parent: '',
            schema: {
              properties: {
                prop1: {
                  relation: 'prop1SchemaId'
                },
              }
            }
          },
          {
            id: 'testSchemaId2',
            parent: '',
            schema: {
              properties: {
                prop1: {
                  relation: 'prop1SchemaId'
                },
                prop2: {
                  relation: 'prop2SchemaId',
                  relation_property: 'prop2RelationPropId', // eslint-disable-line camelcase
                }
              }
            }
          },
          {
            id: 'testSchemaId3',
            parent: '',
            schema: {
              properties: {
                prop3: {
                  relation: 'prop3SchemaId',
                  relation_property: 'prop3RelationPropId', // eslint-disable-line camelcase
                }
              }
            }
          },
          {
            id: 'prop1SchemaId',
            parent: '',
            url: '/v1.0/prop1',
          },
          {
            id: 'prop2SchemaId',
            parent: 'parent1SchemaId',
            url: '/v1.0/prop2',
          },
          {
            id: 'prop3SchemaId',
            parent: 'parent2SchemaId',
            url: '/v1.0/prop3',
          },
          {
            id: 'parent1SchemaId',
            parent: 'parent2SchemaId',
            url: '/v1.0/parent1',
          },
          {
            id: 'parent2SchemaId',
            parent: '',
            url: '/v1.0/parent2',
          }
        ]
      },
      configReducer: {
        polling: false,
        pollingInterval: 10000,
        gohan: {
          url: 'http://gohan.io'
        }
      },
      authReducer: {
        tokenId: 'sampleTokenId'
      }
    }
  );

  describe('fetch()', () => {
    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action when there are no relations with parents`, () => {
      const response = {
        response: {
          testSchemaId1: {
            prop1: 'testId1',
          },
        },
      };

      expectEpic(fetch, {
        expected: [
          '-a',
          {
            a: {
              type: actionTypes.FETCH_SUCCESS,
              data: {
                prop1: 'testId1',
              },
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH,
            schemaId: 'testSchemaId1',
            params: {
              testSchemaId1_id: '123t1' // eslint-disable-line camelcase
            }
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.FETCH_PARENTS} action when there are relations with parents`, () => {
      const response = {
        response: {
          testSchemaId2: {
            prop1: 'testId1',
            prop2: 'testId2',
            prop2RelationPropId: {
              id: 'testId2',
              name: 'Test Prop 2',
            },
          },
        },
      };

      expectEpic(fetch, {
        expected: [
          '-a',
          {
            a: {
              type: actionTypes.FETCH_PARENTS,
              data: {
                prop1: 'testId1',
                prop2: 'testId2',
                prop2RelationPropId: {
                  id: 'testId2',
                  name: 'Test Prop 2',
                },
              },
              withParents: {
                prop2SchemaId: {
                  url: '/v1.0/prop2',
                  relationName: 'prop2RelationPropId',
                  childSchemaId: 'prop2RelationPropId',
                  parent: 'parent1SchemaId',
                  id: 'testId2',
                }
              },
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH,
            schemaId: 'testSchemaId2',
            params: {
              testSchemaId2_id: '123t2' // eslint-disable-line camelcase
            }
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.FETCH_FAILURE} action`, () => {
      const response = {};

      expectEpic(fetch, {
        expected: [
          '-a',
          {
            a: {
              type: actionTypes.FETCH_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.FETCH,
            schemaId: 'testSchemaId1',
            params: {
              testSchemaId1_id: '123t1' // eslint-disable-line camelcase
            }
          },
        }],
        response: [
          '-#|',
          null,
          {
            xhr: response
          }
        ],
        store
      });
    });
  });

  describe('fetchWithParents()', () => {
    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action when there are no relations with parents`, () => {
      const response = {
        response: {
          prop3SchemaId: {
            id: 'idProp3',
            parent2SchemaId_id: 'idParent2', // eslint-disable-line camelcase
          },
        },
      };

      expectEpic(fetchWithParents, {
        expected: [
          '-a',
          {
            a: {
              type: actionTypes.FETCH_SUCCESS,
              data: {
                prop3: 'idProp3',
                prop3RelationPropId: {
                  id: 'idProp3',
                  name: 'Test Prop 3',
                  parents: {
                    parent2SchemaId_id: 'idParent2', // eslint-disable-line camelcase
                  }
                }
              },
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH_PARENTS,
            data: {
              prop3: 'idProp3',
              prop3RelationPropId: {
                id: 'idProp3',
                name: 'Test Prop 3',
              },
            },
            withParents: {
              prop3SchemaId: {
                url: '/v1.0/prop3',
                relationName: 'prop3RelationPropId',
                childSchemaId: 'prop3RelationPropId',
                parent: 'parent2SchemaId',
                id: 'idProp3',
              }
            },
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.FETCH_PARENTS} action when there are relations with parents`, () => {
      const response = {
        response: {
          prop2SchemaId: {
            id: 'idProp2',
            parent1SchemaId_id: 'idParent1', // eslint-disable-line camelcase
          },
        },
      };

      expectEpic(fetchWithParents, {
        expected: [
          '-a',
          {
            a: {
              type: actionTypes.FETCH_PARENTS,
              data: {
                prop2: 'idProp2',
                parent1SchemaId: {
                  parents: {
                    parent1SchemaId_id: 'idParent1', // eslint-disable-line camelcase
                  }
                }
              },
              withParents: {
                parent1SchemaId: {
                  url: '/v1.0/parent1',
                  relationName: 'parent1SchemaId',
                  childSchemaId: 'prop2SchemaId',
                  parent: 'parent2SchemaId',
                  id: 'idParent1',
                }
              }
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH_PARENTS,
            data: {
              prop2: 'idProp2',
            },
            withParents: {
              prop2SchemaId: {
                url: '/v1.0/prop2',
                relationName: 'parent1SchemaId',
                childSchemaId: 'prop2SchemaId',
                parent: 'parent1SchemaId',
                id: 'idProp2',
              },
            },
          }
        }],
        response: ['-a|', {
          a: response,
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.FETCH_FAILURE} action`, () => {
      const response = {};

      expectEpic(fetchWithParents, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.FETCH_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.FETCH_PARENTS,
            data: {
              prop2: 'idProp2',
              prop2SchemaId: {
                parents: {
                  parent1SchemaId_id: 'idParent1', // eslint-disable-line camelcase
                }
              }
            },
            withParents: {
              parent1SchemaId: {
                url: '/v1.0/parent1',
                name: 'parent1SchemaId',
                parent: 'parent2SchemaId',
                id: 'idParent1',
              }
            }
          },
        }],
        response: [
          '-#|',
          null,
          {
            xhr: response
          }
        ],
        store
      });
    });
  });
});
