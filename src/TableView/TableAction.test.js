/* global it, describe, afterEach */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';
import axios from 'axios';

import * as actionTypes from './TableActionTypes';
import * as dialogActionTypes from './../Dialog/DialogActionTypes';
import * as actions from './TableActions';

chai.use(spies);

chai.should();

const _get = axios.get;
const _post = axios.post;
const _put = axios.put;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('TableActions ', () => {
  describe('initialize() ', () => {
    afterEach(() => {
      axios.get = _get;
    });

    it('should create INIT action', () => {
      const storeObject = {};
      const store = mockStore(storeObject);

      store.dispatch(actions.initialize(
        '/v1.0/test',
        'test'
      ));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.INIT,
          data: {
            url: '/v1.0/test',
            plural: 'test'
          }
        }
      ]);

      store.clearActions();

      store.dispatch(actions.initialize(
        '/v1.0/test',
        'test',
        {
          sortOrder: 'asc'
        }
      ));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.INIT,
          data: {
            sortOrder: 'asc',
            url: '/v1.0/test',
            plural: 'test'
          }
        }
      ]);

      store.clearActions();

      store.dispatch(actions.initialize(
        '/v1.0/test',
        'test',
        {
          sortOrder: 'desc'
        }
      ));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.INIT,
          data: {
            sortOrder: 'desc',
            url: '/v1.0/test',
            plural: 'test'
          }
        }
      ]);

      store.clearActions();

      store.dispatch(actions.initialize(
        '/v1.0/test',
        'test',
        {
          sortOrder: 'wrong'
        }
      ));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.INIT,
          data: {
            url: '/v1.0/test',
            plural: 'test'
          }
        }
      ]);
    });
  });

  describe('fetchData() ', () => {
    afterEach(() => {
      axios.get = _get;
    });

    it('should create FETCH_SUCCESS when fetching has finished', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        });
      });
      await store.dispatch(actions.fetchData('test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH_SUCCESS,
          options: {
            totalCount: 1
          },
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        }
      ]);
    });

    it('should create FETCH_FAILURE when fetching has finished', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          status: 409,
        });
      });

      await store.dispatch(actions.fetchData('test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.FETCH_FAILURE,
          error: 'Cannot fetch data!',
        }
      ]);
    });
  });

  describe('sortData() ', () => {
    afterEach(() => {
      axios.get = _get;
    });

    it('should create UPDATE_SORT when sortData method has called', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        });
      });
      await store.dispatch(actions.sortData('name', 'asc', 'test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.UPDATE_SORT,
          data: {
            plural: 'test',
            sortKey: 'name',
            sortOrder: 'asc'
          }
        },
        {
          type: actionTypes.FETCH_SUCCESS,
          options: {
            totalCount: 1
          },
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        }
      ]);
    });

    it('should create UPDATE_SORT_ERROR when sortData method has called with wrong sort order', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        });
      });
      await store.dispatch(actions.sortData('name', 'wrongSortOrder', 'test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.UPDATE_SORT_ERROR,
          error: 'Sort order must by asc or desc!'
        }
      ]);
    });


  });

  describe('setOffset() ', () => {
    afterEach(() => {
      axios.get = _get;
    });

    it('should create UPDATE_OFFSET when setOffset method has called', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        });
      });
      await store.dispatch(actions.setOffset(10, 'test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.UPDATE_OFFSET,
          data: {
            plural: 'test',
            offset: 10
          }
        },
        {
          type: actionTypes.FETCH_SUCCESS,
          options: {
            totalCount: 1
          },
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        }
      ]);
    });

  });

  describe('filterData() ', () => {
    afterEach(() => {
      axios.get = _get;
    });

    it('should create UPDATE_OFFSET and UPDATE_FILTERS when filterData method has called', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        });
      });
      await store.dispatch(actions.filterData({name: 'testName'}, 'test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.UPDATE_OFFSET,
          data: {
            plural: 'test',
            offset: 0
          }
        },
        {
          type: actionTypes.UPDATE_FILTERS,
          data: {
            plural: 'test',
            filters: {
              name: 'testName'
            }
          }
        },
        {
          type: actionTypes.FETCH_SUCCESS,
          options: {
            totalCount: 1
          },
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        }
      ]);
    });

  });

  describe('createData() ', () => {
    afterEach(() => {
      axios.post = _post;
      axios.get = _get;
    });

    it('should create CREATE_SUCCESS when createData method has called', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        });
      });

      axios.post = chai.spy((url, data, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');
        data.name.should.equal('testName');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 201,
          data: {
            test: [
              {
                name: 'testName'
              }
            ]
          }
        });
      });
      await store.dispatch(actions.createData({name: 'testName'}, 'test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CREATE_SUCCESS,
        }
      ]);
    });

    it('should create CREATE_FAILURE when createData method has called', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        });
      });

      axios.post = chai.spy((url, data, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');
        data.name.should.equal('testName');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 409,
          data: {
            error: 'test'
          }
        });
      });
      await store.dispatch(actions.createData({name: 'testName'}, 'test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CREATE_FAILURE,
        },
        {
          type: dialogActionTypes.ERROR,
          message: 'Cannot create new resource!',
        }
      ]);
    });

  });

  describe('updateData() ', () => {
    afterEach(() => {
      axios.put = _put;
      axios.get = _get;
    });

    it('should create UPDATE_SUCCESS when updateData method has called', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        });
      });

      axios.put = chai.spy((url, data, options) => {
        url.should.equal('http://localhost/v1.0/test/sampleID');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');
        data.name.should.equal('newTestName');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'newTestName'
              }
            ]
          }
        });
      });
      await store.dispatch(actions.updateData('sampleID', {name: 'newTestName'}, 'test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.UPDATE_SUCCESS,
        }
      ]);
    });

    it('should create UPDATE_FAILURE when updateData method has called', async () => {
      const storeObject = {
        tableReducer: {
          test: {
            url: '/v1.0/test',
            limit: undefined,
            offset: 0,
            sortKey: undefined,
            sortOrder: undefined,
            filters: {}
          }
        },
        authReducer: {
          tokenId: 'tokenId'
        },
        configReducer: {
          pageLimit: 10,
          gohan: {
            url: 'http://localhost',
            schema: '/schema'
          }
        }
      };
      const store = mockStore(storeObject);

      axios.get = chai.spy((url, options) => {
        url.should.equal('http://localhost/v1.0/test');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 200,
          data: {
            test: [
              {
                name: 'SampleName'
              }
            ]
          }
        });
      });

      axios.put = chai.spy((url, data, options) => {
        url.should.equal('http://localhost/v1.0/test/sampleID');
        options.headers['Content-Type'].should.equal('application/json');
        options.headers['X-Auth-Token'].should.equal('tokenId');
        data.name.should.equal('newTestName');

        return Promise.resolve({
          headers: {
            'x-total-count': 1
          },
          status: 409,
          data: {}
        });
      });
      await store.dispatch(actions.updateData('sampleID', {name: 'newTestName'}, 'test'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.UPDATE_FAILURE,
        },
        {
          type: dialogActionTypes.ERROR,
          message: 'Cannot update resource!',
        }
      ]);
    });

  });

});
