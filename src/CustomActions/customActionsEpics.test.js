/* global it, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import * as actionTypes from './customActionsActionTypes';
import * as dialogActionTypes from '../Dialog/dialogActionTypes';
import {
  execute
} from './customActionsEpics';

chai.should();

describe('CustomActionsEpics', () => {
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

  describe('execute()', () => {
    it(`should dispatch ${actionTypes.EXECUTE_SUCCESS} action`, () => {
      const response = {
        response: {
          test: {
          },
        },
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              type: actionTypes.EXECUTE_SUCCESS
            },
            b: {
              type: dialogActionTypes.CLOSE_ALL
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'GET'
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });
    it(`should dispatch ${actionTypes.EXECUTE_SUCCESS} action for GET method`, () => {
      const response = {
        response: {
          test: {
          },
        },
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              type: actionTypes.EXECUTE_SUCCESS
            },
            b: {
              type: dialogActionTypes.CLOSE_ALL
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'GET'
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });
    it(`should dispatch ${actionTypes.EXECUTE_SUCCESS} action for POST method`, () => {
      const response = {
        response: {
          test: {
          },
        },
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              type: actionTypes.EXECUTE_SUCCESS
            },
            b: {
              type: dialogActionTypes.CLOSE_ALL
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'POST'
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });
    it(`should dispatch ${actionTypes.EXECUTE_SUCCESS} action for PUT method`, () => {
      const response = {
        response: {
          test: {
          },
        },
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              type: actionTypes.EXECUTE_SUCCESS
            },
            b: {
              type: dialogActionTypes.CLOSE_ALL
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'PUT'
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });
    it(`should dispatch ${actionTypes.EXECUTE_SUCCESS} action for DELETE method`, () => {
      const response = {
        response: {
          test: {
          },
        },
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              type: actionTypes.EXECUTE_SUCCESS
            },
            b: {
              type: dialogActionTypes.CLOSE_ALL
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'DELETE'
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.EXECUTE_FAILURE} action for GET method`, () => {
      const response = {};

      expectEpic(execute, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.EXECUTE_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'GET'
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

    it(`should dispatch ${actionTypes.EXECUTE_FAILURE} action for POST method`, () => {
      const response = {};

      expectEpic(execute, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.EXECUTE_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'POST'
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

    it(`should dispatch ${actionTypes.EXECUTE_FAILURE} action for PUT method`, () => {
      const response = {};

      expectEpic(execute, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.EXECUTE_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'PUT'
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

    it(`should dispatch ${actionTypes.EXECUTE_FAILURE} action for DELETE method`, () => {
      const response = {};

      expectEpic(execute, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.EXECUTE_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'DELETE'
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

    it(`should dispatch ${actionTypes.EXECUTE_FAILURE} action for wrong method`, () => {
      const response = {};

      expectEpic(execute, {
        expected: [
          '(a|)',
          {
            a: {
              type: actionTypes.EXECUTE_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.EXECUTE,
            url: '/test/url',
            method: 'wrong method'
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
