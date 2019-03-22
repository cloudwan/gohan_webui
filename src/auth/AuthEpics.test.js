/* global it, describe, beforeEach, afterEach */
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import * as actionTypes from './AuthActionTypes';
import {
  login,
  fetchTenants,
  scopedLogin,
  fetchDomains,
} from './AuthEpics';

chai.should();

describe('AuthEpics', () => {
  describe('Keystone version 3', () => {
    const mockStore = configureMockStore();
    const store = mockStore(
      {
        configReducer: {
          polling: false,
          authUrl: 'http://gohan.io/v3',
          useKeystoneDomain: true,
          cloudAdmin: {
            username: 'admin',
            domainId: 'default',
            projectName: 'admin',
        }
        },
        authReducer: {
          tokenId: 'sampleTokenId',
          unscopedToken: 'unscopedTokenId',
          logged: false,
        }
      }
    );

    describe('login()', () => {
      it(`should dispatch ${actionTypes.LOGIN_SUCCESS} and ${actionTypes.SCOPED_LOGIN} actions for user (cloud admin), domain and password`, () => { // eslint-disable-line
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
                type: actionTypes.SCOPED_LOGIN,
                scope: {
                  project: {
                    name: 'admin',
                    domain: {
                      id: 'default',
                    },
                  }
                }
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

      it(`should dispatch ${actionTypes.LOGIN_SUCCESS} and ${actionTypes.SCOPED_LOGIN} actions for user, domain and password`, () => { // eslint-disable-line
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
                  id: 'foo',
                  name: 'Foo'
                },
                id: '423f19a4ac1e4f48bbb4180756e6eb6c',
                name: 'Bar',
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
                  tokenExpires: '2015-11-06T15:32:17.893769Z',
                  tokenId: 'subjectTokenId',
                  user: {
                    domain: {
                      id: 'foo',
                      name: 'Foo'
                    },
                    id: '423f19a4ac1e4f48bbb4180756e6eb6c',
                    name: 'Bar',
                    password_expires_at: null // eslint-disable-line camelcase
                  }
                }
              },
              b: {
                type: actionTypes.SCOPED_LOGIN,
                scope: {
                  domain: {
                    id: 'foo',
                  },
                }
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.LOGIN,
              username: 'Bar',
              password: 'test_pass',
              domain: 'foo'
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store
        });
      });

      it(`should dispatch ${actionTypes.LOGIN_SUCCESS} and ${actionTypes.SCOPED_LOGIN} actions for user, password and default domain`, () => { // eslint-disable-line
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
                name: 'user1',
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
                  tokenExpires: '2015-11-06T15:32:17.893769Z',
                  tokenId: 'subjectTokenId',
                  user: {
                    domain: {
                      id: 'default',
                      name: 'Default'
                    },
                    id: '423f19a4ac1e4f48bbb4180756e6eb6c',
                    name: 'user1',
                    password_expires_at: null // eslint-disable-line camelcase
                  }
                }
              },
              b: {
                type: actionTypes.SCOPED_LOGIN,
                scope: {
                  domain: {
                    id: 'default',
                  },
                }
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.LOGIN,
              username: 'user1',
              password: 'test_pass',
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store
        });
      });

      it(`should dispatch ${actionTypes.LOGIN_SUCCESS} and ${actionTypes.SCOPED_LOGIN} actions for user, password and domain from config`, () => { // eslint-disable-line
        const customStore = mockStore({
          configReducer: {
            polling: false,
            authUrl: 'http://gohan.io/v3',
            useKeystoneDomain: true,
            domainName: 'configDomainName',
            cloudAdmin: {
              username: 'admin',
              domainId: 'default',
              projectName: 'admin',
            }
          },
          authReducer: {
            tokenId: 'sampleTokenId'
          }
        });

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
                  id: 'configDomainId',
                  name: 'configDomainName'
                },
                id: '423f19a4ac1e4f48bbb4180756e6eb6c',
                name: 'user1',
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
                  tokenExpires: '2015-11-06T15:32:17.893769Z',
                  tokenId: 'subjectTokenId',
                  user: {
                    domain: {
                      id: 'configDomainId',
                      name: 'configDomainName'
                    },
                    id: '423f19a4ac1e4f48bbb4180756e6eb6c',
                    name: 'user1',
                    password_expires_at: null // eslint-disable-line camelcase
                  }
                }
              },
              b: {
                type: actionTypes.SCOPED_LOGIN,
                scope: {
                  domain: {
                    id: 'configDomainId',
                  },
                }
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.LOGIN,
              username: 'user1',
              password: 'test_pass',
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store: customStore,
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

      it(`should dispatch ${actionTypes.FETCH_TENANTS_FAILURE} action`, () => {
        const customStore = mockStore({
          configReducer: {},
          authReducer: {}
        });
        const response = {};

        expectEpic(login, {
          expected: [
            'a|',
            {
              a: {
                type: actionTypes.FETCH_TENANTS_FAILURE,
                error: 'Wrong auth url! Please check config.json.'
              }
            }
          ],
          action: ['a|', {
            a: {
              type: actionTypes.LOGIN,
              username: 'admin',
              password: 'test_pass'
            }
          }],
          response: [
            '#|',
            null,
            {
              xhr: response
            }
          ],
          store: customStore,
        });
      });
    });

    describe('scopedLogin', () => {
      let clock;
      let sandbox;
      let setTimeout;

      beforeEach(() => {
        sandbox = sinon.createSandbox();
        clock = sinon.useFakeTimers({now: new Date('5/6/2017').getTime()});
        setTimeout = global.setTimeout;
        global.setTimeout = () => 123;
      });

      afterEach(() => {
        sandbox.restore();
        clock.restore();
        global.setTimeout = setTimeout;
      });

      it(`should dispatch ${actionTypes.SCOPED_LOGIN_SUCCESS} and ${actionTypes.FETCH_TENANTS} actions for project scope`, () => { // eslint-disable-line
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
              expires_at: '2018-12-23T20:20:31.000000Z', // eslint-disable-line
              project: {
                domain: {
                  id: 'default',
                  name: 'Default'
                },
                id: 'projectId',
                name: 'admin'
              },
              roles: [
                {name: 'admin'},
                {name: 'Member'}
              ],
            }
          }
        };

        expectEpic(scopedLogin, {
          expected: [
            '-(ab)',
            {
              a: {
                type: actionTypes.SCOPED_LOGIN_SUCCESS,
                data: {
                  tokenId: 'subjectTokenId',
                  tokenExpires: '2018-12-23T20:20:31.000000Z',
                  logoutTimeoutId: 123,
                  roles: [
                    {name: 'admin'},
                    {name: 'Member'},
                  ],
                  scope: {
                    project: {
                      id: 'projectId',
                    }
                  },
                }
              },
              b: {
                type: actionTypes.FETCH_TENANTS,
                scope: {
                  project: {
                    domain: {
                      id: 'default',
                      name: 'Default'
                    },
                    id: 'projectId',
                    name: 'admin'
                  },
                  domain: undefined,
                },
              },
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.SCOPED_LOGIN,
              scope: {project: {id: 'projectId'}}
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store,
        });
      });

      it(`should dispatch ${actionTypes.SCOPED_LOGIN_SUCCESS} and ${actionTypes.FETCH_TENANTS} actions for domain scope`, () => { // eslint-disable-line
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
              expires_at: '2018-12-23T20:20:31.000000Z', // eslint-disable-line
              domain: {
                id: 'default',
                name: 'Default'
              },
              roles: [
                {name: 'admin'},
              ],
            }
          }
        };

        expectEpic(scopedLogin, {
          expected: [
            '-(ab)',
            {
              a: {
                type: actionTypes.SCOPED_LOGIN_SUCCESS,
                data: {
                  logoutTimeoutId: 123,
                  tokenId: 'subjectTokenId',
                  tokenExpires: '2018-12-23T20:20:31.000000Z',
                  roles: [
                    {name: 'admin'},
                  ],
                  scope: {
                    domain: {
                      id: 'default',
                    }
                  },
                }
              },
              b: {
                type: actionTypes.FETCH_TENANTS,
                scope: {
                  domain: {
                    id: 'default',
                    name: 'Default'
                  },
                  project: undefined,
                },
              },
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.SCOPED_LOGIN,
              scope: {domain: {id: 'default'}}
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store,
        });
      });

      it(`should dispatch ${actionTypes.FETCH_TENANTS} action for domain scope`, () => {
        const error = {
          message: 'The request you have made requires authentication.',
          status: 401,
          title: 'Unauthorized'
        };

        expectEpic(scopedLogin, {
          expected: [
            '-(a)',
            {
              a: {
                type: actionTypes.FETCH_TENANTS,
                scope: {
                  domain: {
                    id: 'default',
                  }
                }
              },
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.SCOPED_LOGIN,
              scope: {domain: {id: 'default'}}
            }
          }],
          response: ['-#|', null, error],
          store,
        });
      });

      it(`should dispatch ${actionTypes.SCOPED_LOGIN_ERROR} action for domain scope`, () => {
        const response = {};

        expectEpic(scopedLogin, {
          expected: [
            '-(a)',
            {
              a: {
                type: actionTypes.SCOPED_LOGIN_ERROR,
                error: 'Unknown error!',
              },
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.SCOPED_LOGIN,
              scope: {domain: {id: 'default'}}
            }
          }],
          response: [
            '-#|',
            null,
            {
              xhr: response
            }
          ],
          store,
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
                isLogged: true,
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

      it(`should dispatch ${actionTypes.FETCH_TENANTS_SUCCESS} and ${actionTypes.FETCH_DOMAINS} actions for cloud admin user`, () => { // eslint-disable-line
        const customStore = mockStore({
          configReducer: {
            polling: false,
            authUrl: 'http://gohan.io/v3',
            useKeystoneDomain: true,
            cloudAdmin: {
              username: 'admin',
              domainId: 'default',
              projectName: 'admin',
            }
          },
          authReducer: {
            tokenId: 'sampleTokenId',
            unscopedToken: 'unscopedTokenId',
            user: {
              name: 'admin',
              domain: {
                id: 'default'
              }
            }
          }
        });

        const response = {
          response: {
            projects: [
              {
                id: '0c4e939acacf4376bdcd1129f1a054ad',
                name: 'admin',
              },
              {
                id: '0cbd49cbf76d405d9c86562e1d579bd3',
                name: 'demo',
              }
            ]
          },
        };

        expectEpic(fetchTenants, {
          expected: [
            '-(ab)',
            {
              a: {
                type: actionTypes.FETCH_DOMAINS,
              },
              b: {
                type: actionTypes.FETCH_TENANTS_SUCCESS,
                isLogged: true,
                data: [
                  {
                    id: '0c4e939acacf4376bdcd1129f1a054ad',
                    name: 'admin',
                  },
                  {
                    id: '0cbd49cbf76d405d9c86562e1d579bd3',
                    name: 'demo',
                  }
                ]
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.FETCH_TENANTS,
              scope: {
                project: {
                  id: 'adminProjectId',
                }
              }
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store: customStore
        });
      });

      it(`should dispatch ${actionTypes.FETCH_TENANTS_FAILURE} action for no authUrl`, () => {
        const customStore = mockStore({
          configReducer: {},
          authReducer: {},
        });

        const response = {};

        expectEpic(fetchTenants, {
          expected: [
            '(a)',
            {
              a: {
                type: actionTypes.FETCH_TENANTS_FAILURE,
                error: 'Wrong auth url! Please check config.json.',
              },
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.FETCH_TENANTS,
              scope: {
                project: {
                  id: 'adminProjectId',
                }
              }
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store: customStore
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

    describe('fetchDomains', () => {
      it(`should dispatch ${actionTypes.FETCH_DOMAINS_SUCCESS} action`, () => {
        const response = {
          response: {
            domains: [
              {
                name: 'Domain 1',
                id: '1787305a34df4bb7bf2fc7001ae3bb5e'
              }, {
                name: 'Domain 2',
                id: '62d5600de06c48f0aa4f6e841fddb143'
              }, {
                name: 'Default',
                id: 'default'
              }
            ],
          }
        };

        expectEpic(fetchDomains, {
          expected: [
            '-(a)',
            {
              a: {
                type: actionTypes.FETCH_DOMAINS_SUCCESS,
                domains: [
                  {
                    name: 'Domain 1',
                    id: '1787305a34df4bb7bf2fc7001ae3bb5e'
                  }, {
                    name: 'Domain 2',
                    id: '62d5600de06c48f0aa4f6e841fddb143'
                  }, {
                    name: 'Default',
                    id: 'default'
                  }
                ]
              }
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.FETCH_DOMAINS
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store
        });
      });

      it(`should dispatch ${actionTypes.FETCH_DOMAINS_FAILURE} action`, () => {
        const response = {};

        expectEpic(fetchDomains, {
          expected: [
            '-(a|)',
            {
              a: {
                type: actionTypes.FETCH_DOMAINS_FAILURE,
                error: 'Unknown error!'
              }
            }
          ],
          action: ['(a|)', {
            a: {
              type: actionTypes.FETCH_DOMAINS
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

      it(`should dispatch ${actionTypes.FETCH_DOMAINS_FAILURE} action for no authUrl`, () => {
        const customStore = mockStore({
          configReducer: {},
          authReducer: {},
        });

        const response = {};

        expectEpic(fetchDomains, {
          expected: [
            '(a)',
            {
              a: {
                type: actionTypes.FETCH_DOMAINS_FAILURE,
                error: 'Wrong auth url! Please check config.json.',
              },
            }
          ],
          action: ['(a)', {
            a: {
              type: actionTypes.FETCH_DOMAINS,
            }
          }],
          response: ['-a|', {
            a: response
          }],
          store: customStore
        });
      });
    });
  });
});
