/* global it, describe, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';

import * as api from '../api';

import * as actionTypes from './DialogActionTypes';
import * as actions from './DialogActions';
import {Observable} from 'rxjs/Rx';

chai.use(sinonChai);

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
    sinon.stub(api, 'getCollection').callsFake(() => Observable.of({
      payload: [
        {id: 'a1', name: 'Sample name 1', description: 'test description'},
        {id: 'b2', name: 'Sample name 2', description: 'test description'},
        {id: 'c3', name: 'Sample name 3', description: 'test description'}
      ],
      totalCount: 0
    }));

    const schema = {
      properties: {
        petId: {
          description: 'Relation to Pet',
          permission: [
            'create'
          ],
          relation: 'pet',
          relation_property: 'pet', // eslint-disable-line camelcase
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
        petToys: {
          description: 'Array of pet toys ',
          permission: [
            'create',
            'update'
          ],
          title: 'Pet toys',
          type: 'array',
          items: {
            name: {
              title: 'Name',
              description: 'Toy name.',
              type: 'string'
            }
          }
        },
        parts: {
          title: 'Parts',
          description: 'Parts of toy',
          type: 'object',
          items: {
            name: {
              title: 'Name',
              type: 'string'
            }
          }
        }
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
              permission: ['read'],
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

    await store.dispatch(actions.prepareSchema(schema, 'create'));

    store.getActions().should.deep.equal([
      {
        type: actionTypes.PREPARE_SUCCESS,
        data: {
          nullable: false,
          properties: {
            name: {
              description: 'Name',
              nullable: false,
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
              nullable: true,
              options: {
                a1: 'Sample name 1',
                b2: 'Sample name 2',
                c3: 'Sample name 3'
              },
              permission: [
                'create'
              ],
              relation: 'pet',
              relation_property: 'pet', // eslint-disable-line camelcase
              title: 'pet',
              type: 'string'
            },
            petToys: {
              description: 'Array of pet toys ',
              permission: [
                'create',
                'update'
              ],
              title: 'Pet toys',
              type: 'array',
              nullable: false,
              items: {
                name: {
                  title: 'Name',
                  description: 'Toy name.',
                  type: 'string',
                },
                nullable: false
              }
            },
            parts: {
              description: 'Parts of toy',
              items: {
                properties: {
                  id: {
                    title: 'key',
                    type: 'string'
                  },
                  value: {
                    name: {
                      title: 'Name',
                      type: 'string',
                    },
                    title: 'value',
                    type: 'object',
                    nullable: false
                  }
                },
                propertiesOrder: [
                  'id',
                  'value'
                ],
                required: [],
                type: 'object'
              },
              title: 'Parts',
              type: 'array',
              nullable: false
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
    api.getCollection.restore();
  });

  it('should create PREPARE_SUCCESS when relation schema exists but user desn\'t have permission to read', async () => {
    const schema = {
      properties: {
        petId: {
          description: 'Relation to Pet',
          permission: [
            'create'
          ],
          relation: 'pet',
          relation_property: 'pet', // eslint-disable-line camelcase
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
              permission: [],
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

    await store.dispatch(actions.prepareSchema(schema, 'create'));

    store.getActions().should.deep.equal([
      {
        type: actionTypes.PREPARE_SUCCESS,
        data: {
          nullable: false,
          properties: {
            name: {
              description: 'Name',
              nullable: false,
              permission: [
                'create',
                'update'
              ],
              title: 'Name',
              type: 'string'
            },
            petId: {
              description: 'Relation to Pet',
              enum: [],
              nullable: true,
              options: {},
              permission: [
                'create'
              ],
              relation: 'pet',
              relation_property: 'pet', // eslint-disable-line camelcase
              title: 'pet',
              type: 'string'
            },
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

  it('should create PREPARE_SUCCESS when relation schema is undefined', async () => {
    const schema = {
      properties: {
        animalId: {
          description: 'Relation to animal',
          permission: [
            'create'
          ],
          relation: 'animal',
          relation_property: 'animal', // eslint-disable-line camelcase
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

    await store.dispatch(actions.prepareSchema(schema, 'create'));

    store.getActions().should.deep.equal([
      {
        type: actionTypes.PREPARE_SUCCESS,
        data: {
          nullable: false,
          properties: {
            animalId: {
              description: 'Relation to animal',
              permission: [
                'create'
              ],
              nullable: true,
              enum: [],
              options: {},
              relation: 'animal',
              relation_property: 'animal', // eslint-disable-line camelcase
              title: 'animal',
              type: 'string',
            },
            name: {
              description: 'Name',
              nullable: false,
              permission: [
                'create',
                'update'
              ],
              title: 'Name',
              type: 'string'
            },
          }, propertiesOrder: [
            'name',
            'animalId'
          ],
          required: [],
          type: 'object'
        }
      }
    ]);
  });

  it('should create PREPARE_FAILURE when fetching config has been done', async () => {
    sinon.stub(api, 'getCollection').callsFake(() => {
      return Observable.create(observer => observer.error('Cannot fetch data.'));
    });
    const schema = {
      properties: {
        petId: {
          description: 'Relation to Pet',
          permission: [
            'create'
          ],
          relation: 'pet',
          relation_property: 'pet', // eslint-disable-line camelcase
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
      }, propertiesOrder: [
        'id',
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
              permission: ['read'],
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

    await store.dispatch(actions.prepareSchema(schema, 'create'));

    store.getActions().should.deep.equal([
      {
        type: actionTypes.PREPARE_FAILURE,
        error: 'Cannot fetch data.'
      }
    ]);
  });

  describe('openDialog', () => {
    it(`should create ${actionTypes.OPEN}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.openDialog('foo')({id: 'sampleId'}));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.OPEN,
          name: 'foo',
          additionalProps: {id: 'sampleId'}
        }
      ]);
    });
  });

  describe('closeDialog', () => {
    it(`should create ${actionTypes.CLOSE}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.closeDialog('foo')());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CLOSE,
          name: 'foo',
        }
      ]);
    });
  });

  describe('clearError', () => {
    it(`should create ${actionTypes.CLEAR_ERROR}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.clearError());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CLEAR_ERROR,
        }
      ]);
    });
  });

  describe('showError', () => {
    it(`should create ${actionTypes.CLEAR_ERROR}`, () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.showError('Test error message'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.ERROR,
          message: 'Test error message',
        }
      ]);
    });
  });
});
