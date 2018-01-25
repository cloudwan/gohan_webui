/* global it, beforeEach, afterEach, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Observable} from 'rxjs';
import expectEpic from './../../test/helpers/expectEpic';
import * as api from './../api';
import * as actionTypes from './DetailActionTypes';
import * as dialogActionTypes from '../Dialog/DialogActionTypes';
import {
  fetchEpic,
  updateEpic,
  removeEpic
} from './DetailEpics';

chai.should();
chai.use(sinonChai);

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
        },
        followableRelations: false,
      },
      authReducer: {
        tokenId: 'sampleTokenId'
      }
    }
  );

  describe('fetch()', () => {
    beforeEach(() => {
      sinon.stub(api, 'getPollingTimer').callsFake(() => Observable.of(0));
    });

    afterEach(() => {
      api.getPollingTimer.restore();
    });

    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action when there are no relations with parents`, () => {
      const response = {
        payload: {
          prop1: 'testId1',
        },
      };

      expectEpic(fetchEpic, {
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

    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action when there are relations with parents`, () => {
      const response = {
        payload: {
          prop1: 'testId1',
          prop2: 'testId2',
          prop2RelationPropId: {
            id: 'testId2',
            name: 'Test Prop 2',
          },
        },
      };

      expectEpic(fetchEpic, {
        expected: [
          '-a',
          {
            a: {
              type: actionTypes.FETCH_SUCCESS,
              data: {
                prop1: 'testId1',
                prop2: 'testId2',
                prop2RelationPropId: {
                  id: 'testId2',
                  name: 'Test Prop 2',
                }
              }
            }
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
      expectEpic(fetchEpic, {
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
          'Unknown error!'
        ],
        store
      });
    });
  });

  describe('updateEpic', () => {
    it(`should dispatch ${actionTypes.UPDATE_SUCCESS} and ${dialogActionTypes.CLOSE_ALL} actions`, () => {
      const response = {
        response: {},
      };

      expectEpic(updateEpic, {
        expected: [
          '-(abc)',
          {
            a: {
              type: actionTypes.UPDATE_SUCCESS,
              schemaId: 'testSchemaId1',
              params: {
                testSchemaId1: '123'
              },
            },
            b: {
              type: dialogActionTypes.CLOSE_ALL,
            },
            c: {
              type: actionTypes.FETCH,
              params: {
                testSchemaId1: '123'
              },
              schemaId: 'testSchemaId1'
            }
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.UPDATE,
            schemaId: 'testSchemaId1',
            params: {
              testSchemaId1: '123'
            },
            data: {
              name: 'test',
            },
          }
        }],
        response: ['-a|', {
          a: response,
        }],
        store,
      });
    });

    it(`should dispatch ${actionTypes.UPDATE_FAILURE} and ${dialogActionTypes.ERROR} actions`, () => {
      expectEpic(updateEpic, {
        expected: [
          '-(ab|)',
          {
            a: {
              type: actionTypes.UPDATE_FAILURE,
            },
            b: {
              type: dialogActionTypes.ERROR,
              message: 'Unknown error!',
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.UPDATE,
            schemaId: 'testSchemaId1',
            params: {
              testSchemaId1: '123',
            },
            data: {
              name: 'test',
            },
          }
        }],
        response: [
          '-#|',
          null,
          'Unknown error!'
        ],
        store
      });
    });
  });

  describe('removeEpic', () => {
    it(`should dispatch ${actionTypes.DELETE_SUCCESS} action`, () => {
      const response = {
        response: {},
      };

      expectEpic(removeEpic, {
        expected: [
          '-(ab)',
          {
            a: {
              type: actionTypes.DELETE_SUCCESS,
            },
            b: {
              type: actionTypes.FETCH_CANCELLED,
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.DELETE,
            schemaId: 'testSchemaId1',
            params: {
              testSchemaId1: '123',
            },
          }
        }],
        response: ['-a|', {
          a: response,
        }],
        store,
      });
    });

    it(`should dispatch ${actionTypes.DELETE_FAILURE} action`, () => {
      expectEpic(removeEpic, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.DELETE_FAILURE,
              error: 'Unknown error!',
            },
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.DELETE,
            schemaId: 'testSchemaId1',
            params: {
              testSchemaId1: '123'
            },
          }
        }],
        response: [
          '-#|',
          null,
          'Unknown error!'
        ],
        store
      });
    });
  });
});
