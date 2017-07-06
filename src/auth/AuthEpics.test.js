/* global it, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import * as actionTypes from './AuthActionTypes';
import {
  login,
  selectTenant,
  fetchTenants
} from './AuthEpics';

chai.should();

describe('AuthEpics', () => {
  const mockStore = configureMockStore();
  const store = mockStore(
    {
      configReducer: {
        polling: false,
        gohan: {
          url: 'http://gohan.io'
        }
      },
      authReducer: {
        tokenId: 'sampleTokenId'
      }
    }
  );

  describe('login()', () => {
    it(`should dispatch ${actionTypes.LOGIN_SUCCESS} action for user and password`, () => {
      const response = {
        response: {
          access: {
            token: {
              id: 'sample_token_id',
              expires: '6/6/2017',
              tenant: {
                name: 'sampleTenant',
              },
            },
            user: {
              name: 'admin',
            },
          },
        },
      };

      expectEpic(login, {
        expected: [
          '-(ab)',
          {
            a: {
              type: actionTypes.LOGIN_SUCCESS,
              data: {
                tokenId: 'sample_token_id',
                tokenExpires: '6/6/2017',
                tenant: {
                  name: 'sampleTenant',
                },
                user: {
                  name: 'admin',
                },
              }
            },
            b: {
              type: actionTypes.FETCH_TENANTS,
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.LOGIN,
            username: 'admin',
            password: 'test_pass',
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.LOGIN_SUCCESS} action for user, password and tenant`, () => {
      const response = {
        response: {
          access: {
            token: {
              id: 'sample_token_id',
              expires: '6/6/2017',
              tenant: {
                name: 'sampleTenant',
              },
            },
            user: {
              name: 'admin',
            },
          },
        },
      };

      expectEpic(login, {
        expected: [
          '-(ab)',
          {
            a: {
              type: actionTypes.LOGIN_SUCCESS,
              data: {
                tokenId: 'sample_token_id',
                tokenExpires: '6/6/2017',
                tenant: {
                  name: 'sampleTenant',
                },
                user: {
                  name: 'admin',
                },
              }
            },
            b: {
              type: actionTypes.FETCH_TENANTS,
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.LOGIN,
            username: 'admin',
            password: 'test_pass',
            tenant: 'test_tenant',
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.LOGIN_SUCCESS} action for user, password and tenant`, () => {
      const response = {
        response: {
          access: {
            token: {
              id: 'sample_token_id',
              expires: '6/6/2017',
              tenant: {
                name: 'sampleTenant',
              },
            },
            user: {
              name: 'admin',
            },
          },
        },
      };

      expectEpic(login, {
        expected: [
          '-(ab)',
          {
            a: {
              type: actionTypes.LOGIN_SUCCESS,
              data: {
                tokenId: 'sample_token_id',
                tokenExpires: '6/6/2017',
                tenant: {
                  name: 'sampleTenant',
                },
                user: {
                  name: 'admin',
                },
              }
            },
            b: {
              type: actionTypes.FETCH_TENANTS,
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.LOGIN,
            token: 'admin_token',
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.LOGIN_ERROR} action`, () => {
      const response = {};

      expectEpic(login, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.LOGIN_ERROR,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.LOGIN,
            username: 'admin',
            password: 'test_pass',
          }
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

    it(`should dispatch ${actionTypes.LOGIN_ERROR} action`, () => {
      const response = {};

      expectEpic(login, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.LOGIN_ERROR,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.LOGIN,
          }
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

  describe('selectTenant()', () => {
    it(`should dispatch ${actionTypes.LOGIN_SUCCESS} action`, () => {
      const response = {
        response: {
          access: {
            token: {
              id: 'sample_token_id',
              expires: '6/6/2017',
              tenant: {
                name: 'sampleTenant',
              },
            },
            user: {
              name: 'admin',
            },
          },
        },
      };

      expectEpic(selectTenant, {
        expected: [
          '-(a)',
          {
            a: {
              type: actionTypes.LOGIN_SUCCESS,
              data: {
                tokenId: 'sample_token_id',
                tokenExpires: '6/6/2017',
                tenant: {
                  name: 'sampleTenant',
                },
                user: {
                  name: 'admin',
                },
              }
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.SELECT_TENANT,
            tenantName: 'test_tenant',
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.SELECT_TENANT_FAILURE} action`, () => {
      const response = {};

      expectEpic(selectTenant, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.SELECT_TENANT_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.SELECT_TENANT,
            tenantName: 'test_tenant',
          }
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

  describe('fetchTenants()', () => {
    it(`should dispatch ${actionTypes.FETCH_TENANTS_SUCCESS} action`, () => {
      const response = {
        response: {
          tenants: [
            {
              id: 'sample_id',
              name: 'sampleTenant',
            }
          ]
        },
      };

      expectEpic(fetchTenants, {
        expected: [
          '-(a)',
          {
            a: {
              type: actionTypes.FETCH_TENANTS_SUCCESS,
              data: [
                {
                  id: 'sample_id',
                  name: 'sampleTenant',
                }
              ]
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH_TENANTS,
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.FETCH_TENANTS_FAILURE} action`, () => {
      const response = {};

      expectEpic(fetchTenants, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.FETCH_TENANTS_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.FETCH_TENANTS,
          }
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

    it(`should dispatch ${actionTypes.LOGIN_ERROR} action`, () => {
      const response = {};

      expectEpic(login, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.LOGIN_ERROR,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.LOGIN,
          }
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
