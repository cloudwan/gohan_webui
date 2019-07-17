/* global it, describe, afterEach */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';
import {Observable} from 'rxjs/Rx';

import * as api from '../api';

import * as actionTypes from './FormActionTypes';
import * as actions from './FormActions';

chai.use(sinonChai);

chai.should();

const _get = axios.get;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('FormActions', () => {
  afterEach(() => {
    axios.get = _get;
  });

  describe('prepareSchemaSuccess()', () => {
    it(`should dispatch ${actionTypes.PREPARE_SCHEMA_SUCCESS}`, () => {
      const storeState = {};
      const store = mockStore(storeState);

      actions.prepareSchemaSuccess('formName', {})(store.dispatch).should.deep.equal({
        type: actionTypes.PREPARE_SCHEMA_SUCCESS,
        formName: 'formName',
        data: {
          schema: {}
        }
      });
    });
  });

  describe('prepareSchemaFailure()', () => {
    it(`should dispatch ${actionTypes.PREPARE_SCHEMA_FAILURE} with string`, () => {
      const storeState = {};
      const store = mockStore(storeState);

      actions.prepareSchemaFailure('formName', 'error')(store.dispatch).should.deep.equal({
        type: actionTypes.PREPARE_SCHEMA_FAILURE,
        formName: 'formName',
        error: 'error'
      });
    });

    it(`should dispatch ${actionTypes.PREPARE_SCHEMA_FAILURE} with an error object`, () => {
      const storeState = {};
      const store = mockStore(storeState);

      actions.prepareSchemaFailure('formName', {data: 'error'})(store.dispatch).should.deep.equal({
        type: actionTypes.PREPARE_SCHEMA_FAILURE,
        formName: 'formName',
        error: 'error'
      });
    });
  });

  describe('prepareSchema()', () => {
    it(`should dispatch ${actionTypes.PREPARE_SCHEMA_START}`, () => {
      const storeState = {};
      const store = mockStore(storeState);

      store.dispatch(actions.prepareSchema('formName', {}, 'create', undefined, {}));

      store.getActions()[0].should.deep.equal({
        type: actionTypes.PREPARE_SCHEMA_START,
        formName: 'formName'
      });
    });

    it(`should dispatch ${actionTypes.PREPARE_SCHEMA_SUCCESS}`, async () => {
      const storeState = {
        formReducer: {},
        schemaReducer: {
          data: [
            {
              id: 'pet',
              type: 'string',
              permission: ['create']
            }
          ]
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeState);
      const schema = {
        properties: {
          foo: {
            description: 'foo',
            permission: ['create'],
            type: 'string'
          }
        },
        propertiesOrder: ['foo'],
        required: [],
        type: 'object'
      };

      await store.dispatch(actions.prepareSchema('formName', schema, 'create', undefined, {}));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.PREPARE_SCHEMA_START,
          formName: 'formName'
        },
        {
          type: actionTypes.PREPARE_SCHEMA_SUCCESS,
          formName: 'formName',
          data: {
            schema: {
              nullable: false,
              properties: {
                foo: {
                  description: 'foo',
                  nullable: false,
                  permission: ['create'],
                  type: 'string'
                }
              },
              propertiesOrder: ['foo'],
              type: 'object',
              required: []
            }
          }
        }
      ]);
    });

    it(`should create ${actionTypes.PREPARE_SCHEMA_FAILURE} when fetching gots an error`, async () => {
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

      await store.dispatch(actions.prepareSchema('formName', schema, 'create'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.PREPARE_SCHEMA_START,
          formName: 'formName'
        },
        {
          type: actionTypes.PREPARE_SCHEMA_FAILURE,
          formName: 'formName',
          error: 'Cannot fetch data.'
        }
      ]);
    });
  });

  describe('clearData()', () => {
    it(`should dispatch ${actionTypes.CLEAR_FORM_DATA}`, () => {
      const store = mockStore({});

      store.dispatch(actions.clearData('formName'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CLEAR_FORM_DATA,
          formName: 'formName'
        }
      ]);
    });
  });

  describe('showError()', () => {
    it(`should dispatch ${actionTypes.SHOW_ERROR}`, () => {
      const store = mockStore({});

      store.dispatch(actions.showError('formName', 'error'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.SHOW_ERROR,
          formName: 'formName',
          error: 'error'
        }
      ]);
    });
  });

  describe('clearError()', () => {
    it(`should dispatch ${actionTypes.CLEAR_ERROR}`, () => {
      const store = mockStore({});

      store.dispatch(actions.clearError('formName'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CLEAR_ERROR,
          formName: 'formName'
        }
      ]);
    });
  });

  describe('clearAllFormsData()', () => {
    it(`should dispatch ${actionTypes.CLEAR_ALL_FORMS_DATA}`, () => {
      const store = mockStore({});

      store.dispatch(actions.clearAllFormsData());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CLEAR_ALL_FORMS_DATA
        }
      ]);
    });
  });

  describe('overwriteSchema()', () => {
    it(`should dispatch ${actionTypes.OVERWRITE_SCHEMA}`, () => {
      const store = mockStore({});

      store.dispatch(actions.overwriteSchema('formName', {}));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.OVERWRITE_SCHEMA,
          formName: 'formName',
          data: {
            schema: {}
          }
        }
      ]);
    });
  });
});
