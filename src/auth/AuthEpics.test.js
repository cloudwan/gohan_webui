/* global it, describe, beforeEach, afterEach */
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
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
  describe('Keystone version 2', () => {
    const mockStore = configureMockStore();
    const store = mockStore(
      {
        configReducer: {
          polling: false,
          authUrl: 'http://gohan.io/v2.0',
        },
        authReducer: {
          tokenId: 'sampleTokenId'
        }
      }
    );

    describe('login()', () => {
      let clock;
      let sandbox;

      beforeEach(() => {
        sandbox = sinon.createSandbox();
        clock = sinon.useFakeTimers({now: new Date('5/6/2017').getTime()});
      });

      afterEach(() => {
        sandbox.restore();
        clock.restore();
      });

      it(`should dispatch ${actionTypes.LOGIN_SUCCESS} action for user and password`, () => {
        const response = {
          response: {
            access: {
              token: {
                id: 'sample_token_id',
                expires: '6/6/2017',
                tenant: {
                  name: 'sampleTenant'
                }
              },
              user: {
                name: 'admin'
              }
            }
          }
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
                    name: 'sampleTenant'
                  },
                  user: {
                    name: 'admin'
                  }
                }
              },
              b: {
                type: actionTypes.FETCH_TENANTS
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.LOGIN,
              username: 'admin',
              password: 'test_pass'
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
                  name: 'sampleTenant'
                }
              },
              user: {
                name: 'admin'
              }
            }
          }
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
                    name: 'sampleTenant'
                  },
                  user: {
                    name: 'admin'
                  }
                }
              },
              b: {
                type: actionTypes.FETCH_TENANTS
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.LOGIN,
              username: 'admin',
              password: 'test_pass',
              tenant: 'test_tenant'
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
                  name: 'sampleTenant'
                }
              },
              user: {
                name: 'admin'
              }
            }
          }
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
                    name: 'sampleTenant'
                  },
                  user: {
                    name: 'admin'
                  }
                }
              },
              b: {
                type: actionTypes.FETCH_TENANTS
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.LOGIN,
              token: 'admin_token'
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
              password: 'test_pass'
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
              type: actionTypes.LOGIN
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
                  name: 'sampleTenant'
                }
              },
              user: {
                name: 'admin'
              }
            }
          }
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
                    name: 'sampleTenant'
                  },
                  user: {
                    name: 'admin'
                  }
                }
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.SELECT_TENANT,
              tenantName: 'test_tenant'
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
              tenantName: 'test_tenant'
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
                name: 'sampleTenant'
              }
            ]
          }
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
                    name: 'sampleTenant'
                  }
                ]
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.FETCH_TENANTS
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
              type: actionTypes.FETCH_TENANTS
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
              type: actionTypes.LOGIN
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

  describe('Keystone version 3', () => {
    const mockStore = configureMockStore();
    const store = mockStore(
      {
        configReducer: {
          polling: false,
          authUrl: 'http://gohan.io/v3',
          useKeystoneDomain: true
        },
        authReducer: {
          tokenId: 'sampleTokenId'
        }
      }
    );

    describe('login()', () => {
      let clock;
      let sandbox;

      beforeEach(() => {
        sandbox = sinon.createSandbox();
        clock = sinon.useFakeTimers({now: new Date('5/6/2017').getTime()});
      });

      afterEach(() => {
        sandbox.restore();
        clock.restore();
      });

      it(`should dispatch ${actionTypes.LOGIN_SUCCESS} action for user and password`, () => {
        const response = {
          xhr: {
            getResponseHeader: header => {
              switch (header) {
                case 'X-Subject-Token':
                  return 'subjectTokenId';
              }
            }
          },
          response: {
            token: {
              methods: [
                'password'
              ],
              expires_at: '2015-11-06T15:32:17.893769Z', // eslint-disable-line camelcase
              extras: {},
              user: {
                domain: {
                  id: 'default',
                  name: 'Default'
                },
                id: '423f19a4ac1e4f48bbb4180756e6eb6c',
                name: 'admin',
                password_expires_at: null // eslint-disable-line camelcase
              },
              audit_ids: [ // eslint-disable-line camelcase
                'ZzZwkUflQfygX7pdYDBCQQ'
              ],
              issued_at: '2015-11-06T14:32:17.893797Z' // eslint-disable-line camelcase
            }
          }
        };

        expectEpic(login, {
          expected: [
            '-(ab)',
            {
              a: {
                type: actionTypes.LOGIN_SUCCESS,
                data: {
                  tenant: undefined,
                  tokenExpires: '2015-11-06T15:32:17.893769Z',
                  tokenId: 'subjectTokenId',
                  user: {
                    domain: {
                      id: 'default',
                      name: 'Default'
                    },
                    id: '423f19a4ac1e4f48bbb4180756e6eb6c',
                    name: 'admin',
                    password_expires_at: null // eslint-disable-line camelcase
                  }
                }
              },
              b: {
                type: actionTypes.FETCH_TENANTS
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.LOGIN,
              username: 'admin',
              password: 'test_pass',
              domain: 'default'
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store
        });
      });

      it(`should dispatch ${actionTypes.LOGIN_SUCCESS} action for user, password and tenant - scoped authorization`,
        () => {
          const response = {
            xhr: {
              getResponseHeader: header => {
                switch (header) {
                  case 'X-Subject-Token':
                    return 'subjectTokenId';
                }
              }
            },
            response: {
              token: {
                methods: [
                  'password'
                ],
                roles: [
                  {
                    id: '51cc68287d524c759f47c811e6463340',
                    name: 'admin'
                  }
                ],
                expires_at: '2015-11-07T02:58:43.578887Z', // eslint-disable-line camelcase
                project: {
                  domain: {
                    id: 'default',
                    name: 'Default'
                  },
                  id: 'a6944d763bf64ee6a275f1263fae0352',
                  name: 'admin'
                },
                is_domain: false, // eslint-disable-line camelcase
                catalog: [],
                extras: {},
                user: {
                  domain: {
                    id: 'default',
                    name: 'Default'
                  },
                  id: 'ee4dfb6e5540447cb3741905149d9b6e',
                  name: 'admin',
                  password_expires_at: '2016-11-06T15:32:17.000000' // eslint-disable-line camelcase
                },
                audit_ids: [ // eslint-disable-line camelcase
                  '3T2dc1CGQxyJsHdDu1xkcw'
                ],
                issued_at: '2015-11-07T01:58:43.578929Z' // eslint-disable-line camelcase
              }
            }
          };

          expectEpic(login, {
            expected: [
              '-(ab)',
              {
                a: {
                  type: actionTypes.LOGIN_SUCCESS,
                  data: {
                    tenant: {
                      domain: {
                        id: 'default',
                        name: 'Default'
                      },
                      id: 'a6944d763bf64ee6a275f1263fae0352',
                      name: 'admin'
                    },
                    tokenExpires: '2015-11-07T02:58:43.578887Z',
                    tokenId: 'subjectTokenId',
                    user: {
                      domain: {
                        id: 'default',
                        name: 'Default'
                      },
                      id: 'ee4dfb6e5540447cb3741905149d9b6e',
                      name: 'admin',
                      password_expires_at: '2016-11-06T15:32:17.000000' // eslint-disable-line camelcase
                    }
                  }
                },
                b: {
                  type: actionTypes.FETCH_TENANTS
                }
              }
            ],
            action: ['(a)', {
              a: {
                type: actionTypes.LOGIN,
                username: 'admin',
                password: 'test_pass',
                tenant: 'admin',
                tenantId: 'a6944d763bf64ee6a275f1263fae0352'
              }
            }],
            response: ['-a|', {
              a: response
            }],
            store
          });
        });

      it(`should dispatch ${actionTypes.LOGIN_SUCCESS} action for token with tenant id`, () => {
        const response = {
          xhr: {
            getResponseHeader: header => {
              switch (header) {
                case 'X-Subject-Token':
                  return 'subjectTokenId';
              }
            }
          },
          response: {
            token: {
              methods: [
                'password'
              ],
              roles: [
                {
                  id: '51cc68287d524c759f47c811e6463340',
                  name: 'admin'
                }
              ],
              expires_at: '2015-11-07T02:58:43.578887Z', // eslint-disable-line camelcase
              project: {
                domain: {
                  id: 'default',
                  name: 'Default'
                },
                id: 'a6944d763bf64ee6a275f1263fae0352',
                name: 'admin'
              },
              is_domain: false, // eslint-disable-line camelcase
              catalog: [],
              extras: {},
              user: {
                domain: {
                  id: 'default',
                  name: 'Default'
                },
                id: 'ee4dfb6e5540447cb3741905149d9b6e',
                name: 'admin',
                password_expires_at: '2016-11-06T15:32:17.000000' // eslint-disable-line camelcase
              },
              audit_ids: [ // eslint-disable-line camelcase
                '3T2dc1CGQxyJsHdDu1xkcw'
              ],
              issued_at: '2015-11-07T01:58:43.578929Z' // eslint-disable-line camelcase
            }
          }
        };

        expectEpic(login, {
          expected: [
            '-(ab)',
            {
              a: {
                type: actionTypes.LOGIN_SUCCESS,
                data: {
                  tenant: {
                    domain: {
                      id: 'default',
                      name: 'Default'
                    },
                    id: 'a6944d763bf64ee6a275f1263fae0352',
                    name: 'admin'
                  },
                  tokenExpires: '2015-11-07T02:58:43.578887Z',
                  tokenId: 'subjectTokenId',
                  user: {
                    domain: {
                      id: 'default',
                      name: 'Default'
                    },
                    id: 'ee4dfb6e5540447cb3741905149d9b6e',
                    name: 'admin',
                    password_expires_at: '2016-11-06T15:32:17.000000' // eslint-disable-line camelcase
                  }
                }
              },
              b: {
                type: actionTypes.FETCH_TENANTS
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.LOGIN,
              token: 'admin_token',
              tenantId: 'a6944d763bf64ee6a275f1263fae0352'
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store
        });
      });

      it(`should dispatch ${actionTypes.LOGIN_SUCCESS} action for token without tenant id`, () => {
        const response = {
          xhr: {
            getResponseHeader: header => {
              switch (header) {
                case 'X-Subject-Token':
                  return 'subjectTokenId';
              }
            }
          },
          response: {
            token: {
              methods: [
                'password'
              ],
              roles: [
                {
                  id: '51cc68287d524c759f47c811e6463340',
                  name: 'admin'
                }
              ],
              expires_at: '2015-11-07T02:58:43.578887Z', // eslint-disable-line camelcase
              project: {
                domain: {
                  id: 'default',
                  name: 'Default'
                },
                id: 'a6944d763bf64ee6a275f1263fae0352',
                name: 'admin'
              },
              is_domain: false, // eslint-disable-line camelcase
              catalog: [],
              extras: {},
              user: {
                domain: {
                  id: 'default',
                  name: 'Default'
                },
                id: 'ee4dfb6e5540447cb3741905149d9b6e',
                name: 'admin',
                password_expires_at: '2016-11-06T15:32:17.000000' // eslint-disable-line camelcase
              },
              audit_ids: [ // eslint-disable-line camelcase
                '3T2dc1CGQxyJsHdDu1xkcw'
              ],
              issued_at: '2015-11-07T01:58:43.578929Z' // eslint-disable-line camelcase
            }
          }
        };

        expectEpic(login, {
          expected: [
            '-(ab)',
            {
              a: {
                type: actionTypes.LOGIN_SUCCESS,
                data: {
                  tenant: undefined,
                  tokenExpires: '2015-11-07T02:58:43.578887Z',
                  tokenId: 'subjectTokenId',
                  user: {
                    domain: {
                      id: 'default',
                      name: 'Default'
                    },
                    id: 'ee4dfb6e5540447cb3741905149d9b6e',
                    name: 'admin',
                    password_expires_at: '2016-11-06T15:32:17.000000' // eslint-disable-line camelcase
                  }
                }
              },
              b: {
                type: actionTypes.FETCH_TENANTS
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.LOGIN,
              token: 'admin_token'
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
              password: 'test_pass'
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
          xhr: {
            getResponseHeader: header => {
              switch (header) {
                case 'X-Subject-Token':
                  return 'subjectTokenId';
              }
            }
          },
          response: {
            token: {
              methods: [
                'password'
              ],
              roles: [
                {
                  id: '51cc68287d524c759f47c811e6463340',
                  name: 'admin'
                }
              ],
              expires_at: '2015-11-07T02:58:43.578887Z', // eslint-disable-line camelcase
              project: {
                domain: {
                  id: 'default',
                  name: 'Default'
                },
                id: 'a6944d763bf64ee6a275f1263fae0352',
                name: 'admin'
              },
              is_domain: false, // eslint-disable-line camelcase
              catalog: [],
              extras: {},
              user: {
                domain: {
                  id: 'default',
                  name: 'Default'
                },
                id: 'ee4dfb6e5540447cb3741905149d9b6e',
                name: 'admin',
                password_expires_at: '2016-11-06T15:32:17.000000' // eslint-disable-line camelcase
              },
              audit_ids: [ // eslint-disable-line camelcase
                '3T2dc1CGQxyJsHdDu1xkcw'
              ],
              issued_at: '2015-11-07T01:58:43.578929Z' // eslint-disable-line camelcase
            }
          }
        };

        expectEpic(selectTenant, {
          expected: [
            '-(a)',
            {
              a: {
                type: actionTypes.LOGIN_SUCCESS,
                data: {
                  tokenId: 'subjectTokenId',
                  tokenExpires: '2015-11-07T02:58:43.578887Z',
                  tenant: {
                    domain: {
                      id: 'default',
                      name: 'Default'
                    },
                    id: 'a6944d763bf64ee6a275f1263fae0352',
                    name: 'admin'
                  },
                  user: {
                    domain: {
                      id: 'default',
                      name: 'Default'
                    },
                    id: 'ee4dfb6e5540447cb3741905149d9b6e',
                    name: 'admin',
                    password_expires_at: '2016-11-06T15:32:17.000000' // eslint-disable-line camelcase
                  }
                }
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.SELECT_TENANT,
              tenantName: 'test_tenant',
              tenantId: 'a6944d763bf64ee6a275f1263fae0352'
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
              tenantId: 'tenantId'
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
            links: {
              next: null,
              previous: null,
              self: 'http://example.com/identity/v3/projects'
            },
            projects: [
              {
                is_domain: false, // eslint-disable-line camelcase
                description: 'Description',
                domain_id: 'default', // eslint-disable-line camelcase
                enabled: true,
                id: '0c4e939acacf4376bdcd1129f1a054ad',
                links: {
                  self: 'http://example.com/identity/v3/projects/0c4e939acacf4376bdcd1129f1a054ad'
                },
                name: 'admin',
                parent_id: null // eslint-disable-line camelcase
              },
              {
                is_domain: false, // eslint-disable-line camelcase
                description: 'Description 2',
                domain_id: 'default', // eslint-disable-line camelcase
                enabled: true,
                id: '0cbd49cbf76d405d9c86562e1d579bd3',
                links: {
                  self: 'http://example.com/identity/v3/projects/0cbd49cbf76d405d9c86562e1d579bd3'
                },
                name: 'demo',
                parent_id: null // eslint-disable-line camelcase
              }
            ]
          }
        };

        expectEpic(fetchTenants, {
          expected: [
            '-(a)',
            {
              a: {
                type: actionTypes.FETCH_TENANTS_SUCCESS,
                data: [
                  {
                    is_domain: false, // eslint-disable-line camelcase
                    description: 'Description',
                    domain_id: 'default', // eslint-disable-line camelcase
                    enabled: true,
                    id: '0c4e939acacf4376bdcd1129f1a054ad',
                    links: {
                      self: 'http://example.com/identity/v3/projects/0c4e939acacf4376bdcd1129f1a054ad'
                    },
                    name: 'admin',
                    parent_id: null // eslint-disable-line camelcase
                  },
                  {
                    is_domain: false, // eslint-disable-line camelcase
                    description: 'Description 2',
                    domain_id: 'default', // eslint-disable-line camelcase
                    enabled: true,
                    id: '0cbd49cbf76d405d9c86562e1d579bd3',
                    links: {
                      self: 'http://example.com/identity/v3/projects/0cbd49cbf76d405d9c86562e1d579bd3'
                    },
                    name: 'demo',
                    parent_id: null // eslint-disable-line camelcase
                  }
                ]
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.FETCH_TENANTS
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
              type: actionTypes.FETCH_TENANTS
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
              type: actionTypes.LOGIN
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
});
