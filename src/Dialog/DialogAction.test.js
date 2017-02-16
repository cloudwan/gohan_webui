/* global it, describe, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';
import axios from 'axios';

import * as actionTypes from './DialogActionTypes';
import * as actions from './DialogActions';

chai.use(spies);

chai.should();

const _get = axios.get;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('DialogActions ', () => {
  afterEach(() => {
    axios.get = _get;
  });

  it('should create CLEAR_DATA', () => {
    const storeObject = {};
    const store = mockStore(storeObject);

    store.dispatch(actions.clearData());

    store.getActions().should.deep.equal([
      {
        type: actionTypes.CLEAR_DATA
      }
    ]);
  });

  it('should create PREPARE_SUCCESS when fetching config has been done', async () => {
    const schema = {
      properties: {
        petId: {
          description: 'Relation to Pet',
          permission: [
            'create'
          ],
          relation: 'pet',
          relation_property: 'pet',  // eslint-disable-line camelcase
          title: 'pet',
          type: [
            'string',
            'null'
          ]
        },
        id: {
          description: 'ID',
          permission: [
            'create'
          ],
          title: 'ID',
          type: 'string',
          view: [
            'detail'
          ]
        },
        name: {
          description: 'Name',
          permission: [
            'create',
            'update'
          ],
          title: 'Name',
          type: 'string'
        },
      }, propertiesOrder: [
        'id',
        'name',
        'petId'
      ],
      required: [],
      type: 'object'
    };
    const storeObject = {
      authReducer: {
        tokenId: 'tokenId'
      },
      schemaReducer: {
        data: [
          {
            actions: {},
            description: 'Pet',
            id: 'pet',
            metadata: {},
            namespace: '',
            parent: '',
            plural: 'pet',
            prefix: '/v1.0',
            schema: {
              properties: {
                description: {
                  description: 'Description',
                  permission: [
                    'create',
                    'update'
                  ],
                  title: 'Description',
                  type: 'string',
                  view: [
                    'detail'
                  ]
                },
                id: {
                  description: 'ID',
                  permission: [
                    'create'
                  ],
                  title: 'ID',
                  type: 'string',
                  view: [
                    'detail'
                  ]
                },
                name: {
                  description: 'Name of Pet.',
                  permission: [
                    'create',
                    'update'
                  ],
                  title: 'Name',
                  type: 'string'
                },
              },
              propertiesOrder: [
                'id',
                'name',
                'description'
              ],
              required: [
                'name'
              ],
              type: 'object'
            },
            singular: 'pet',
            title: 'Pet',
            url: '/v1.0/pets'
          }
        ]
      },
      configReducer: {
        gohan: {
          url: 'http://localhost',
          schema: '/schema'
        }
      }
    };
    const store = mockStore(storeObject);

    axios.get = chai.spy((url, headers) => {
      url.should.equal('http://localhost/v1.0/pets');
      headers.headers['Content-Type'].should.equal('application/json');
      headers.headers['X-Auth-Token'].should.equal('tokenId');

      return Promise.resolve({
        data: {
          pets: [
            {id: 'a1', name: 'Sample name 1', description: 'test description'},
            {id: 'b2', name: 'Sample name 2', description: 'test description'},
            {id: 'c3', name: 'Sample name 3', description: 'test description'}
          ]
        }
      });
    });
    await store.dispatch(actions.prepareSchema(schema, 'create'));

    store.getActions().should.deep.equal([
      {
        type: actionTypes.PREPARE_SUCCESS,
        data: {
          properties: {
            name: {
              description: 'Name',
              permission: [
                'create',
                'update'
              ],
              title: 'Name',
              type: 'string'
            },
            petId: {
              description: 'Relation to Pet',
              enum: [
                'a1',
                'b2',
                'c3'
              ],
              options: {
                a1: 'Sample name 1',
                b2: 'Sample name 2',
                c3: 'Sample name 3'
              },
              permission: [
                'create'
              ],
              relation: 'pet',
              relation_property: 'pet',  // eslint-disable-line camelcase
              title: 'pet',
              type: 'string'
            }
          },
          propertiesOrder: [
            'name',
            'petId'
          ],
          required: [],
          type: 'object'
        }
      }
    ]);
  });

  it('should create PREPARE_FAILURE when fetching config has been done', async () => {
    const schema = {
      properties: {
        petId: {
          description: 'Relation to Pet',
          permission: [
            'create'
          ],
          relation: 'pet',
          relation_property: 'pet',  // eslint-disable-line camelcase
          title: 'pet',
          type: [
            'string',
            'null'
          ]
        },
        id: {
          description: 'ID',
          permission: [
            'create'
          ],
          title: 'ID',
          type: 'string',
          view: [
            'detail'
          ]
        },
        name: {
          description: 'Name',
          permission: [
            'create',
            'update'
          ],
          title: 'Name',
          type: 'string'
        },
      }, propertiesOrder: [
        'id',
        'name',
        'petId'
      ],
      required: [],
      type: 'object'
    };
    const storeObject = {
      authReducer: {
        tokenId: 'tokenId'
      },
      schemaReducer: {
        data: [
          {
            actions: {},
            description: 'Pet',
            id: 'pet',
            metadata: {},
            namespace: '',
            parent: '',
            plural: 'pet',
            prefix: '/v1.0',
            schema: {
              properties: {
                description: {
                  description: 'Description',
                  permission: [
                    'create',
                    'update'
                  ],
                  title: 'Description',
                  type: 'string',
                  view: [
                    'detail'
                  ]
                },
                id: {
                  description: 'ID',
                  permission: [
                    'create'
                  ],
                  title: 'ID',
                  type: 'string',
                  view: [
                    'detail'
                  ]
                },
                name: {
                  description: 'Name of Pet.',
                  permission: [
                    'create',
                    'update'
                  ],
                  title: 'Name',
                  type: 'string'
                },
              },
              propertiesOrder: [
                'id',
                'name',
                'description'
              ],
              required: [
                'name'
              ],
              type: 'object'
            },
            singular: 'pet',
            title: 'Pet',
            url: '/v1.0/pets'
          }
        ]
      },
      configReducer: {
        gohan: {
          url: 'http://localhost',
          schema: '/schema'
        }
      }
    };
    const store = mockStore(storeObject);

    axios.get = chai.spy((url, headers) => {
      url.should.equal('http://localhost/v1.0/pets');
      headers.headers['Content-Type'].should.equal('application/json');
      headers.headers['X-Auth-Token'].should.equal('tokenId');

      return Promise.reject({
        response: {
          data: 'Cannot fetch data.'
        }
      });
    });
    await store.dispatch(actions.prepareSchema(schema, 'create'));

    store.getActions().should.deep.equal([
      {
        type: actionTypes.PREPARE_FAILURE,
        error: 'Cannot fetch data.'
      }
    ]);

    // Else statement.
    store.clearActions();

    const schema2 = {
      properties: {
        animalId: {
          description: 'Relation to animal',
          permission: [
            'create'
          ],
          relation: 'animal',
          relation_property: 'animal',  // eslint-disable-line camelcase
          title: 'animal',
          type: [
            'string',
            'null'
          ]
        },
        id: {
          description: 'ID',
          permission: [
            'create'
          ],
          title: 'ID',
          type: 'string',
          view: [
            'detail'
          ]
        },
        name: {
          description: 'Name',
          permission: [
            'create',
            'update'
          ],
          title: 'Name',
          type: 'string'
        },
      }, propertiesOrder: [
        'id',
        'name',
        'animalId'
      ],
      required: [],
      type: 'object'
    };

    await store.dispatch(actions.prepareSchema(schema2, 'create'));

    store.getActions().should.deep.equal([
      {
        type: actionTypes.PREPARE_FAILURE,
        error: 'Cannot find related schema!'
      }
    ]);

  });
});
