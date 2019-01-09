/* global it, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import * as actionTypes from './CustomActionsActionTypes';
import * as dialogActionTypes from './../Dialog/DialogActionTypes';
import * as successToasterActionTypes from './../SuccessToaster/SuccessToasterActionTypes';
import {
  execute
} from './CustomActionsEpics';

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
    it(`should dispatch ${successToasterActionTypes.SUCCESS} action`, () => {
      const response = {
        response: {
          test: {
          },
        },
        xhr: {
          getResponseHeader: () => 'text/html',
          responseURL: 'https://foo.bar',
        }
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              title: 'The Custom Action was Successful',
              type: successToasterActionTypes.SUCCESS,
              url: 'https://foo.bar',
              isDataHtml: true,
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
    it(`should dispatch ${successToasterActionTypes.SUCCESS} action for GET method`, () => {
      const response = {
        response: {
          test: {
          },
        },
        xhr: {
          getResponseHeader: () => 'application/json',
          responseURL: 'https://foo.bar',
        }
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              title: 'The Custom Action was Successful',
              type: successToasterActionTypes.SUCCESS,
              url: 'https://foo.bar',
              isDataHtml: false,
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
    it(`should dispatch ${successToasterActionTypes.SUCCESS} action for POST method`, () => {
      const response = {
        response: {
          test: {
          },
        },
        xhr: {
          getResponseHeader: () => 'application/json',
          responseURL: 'https://foo.bar',
        }
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              title: 'The Custom Action was Successful',
              type: successToasterActionTypes.SUCCESS,
              url: 'https://foo.bar',
              isDataHtml: false,
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
    it(`should dispatch ${successToasterActionTypes.SUCCESS} action for PUT method`, () => {
      const response = {
        response: {
          test: {
          },
        },
        xhr: {
          getResponseHeader: () => 'application/json',
          responseURL: 'https://foo.bar',
        }
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              title: 'The Custom Action was Successful',
              type: successToasterActionTypes.SUCCESS,
              url: 'https://foo.bar',
              isDataHtml: false,
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
    it(`should dispatch ${successToasterActionTypes.SUCCESS} action for DELETE method`, () => {
      const response = {
        response: {
          test: {
          },
        },
        xhr: {
          getResponseHeader: () => 'application/json',
          responseURL: 'https://foo.bar',
        }
      };

      expectEpic(execute, {
        expected: [
          '-(ab)',
          {
            a: {
              data: {
                test: {}
              },
              type: successToasterActionTypes.SUCCESS,
              title: 'The Custom Action was Successful',
              url: 'https://foo.bar',
              isDataHtml: false,
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
