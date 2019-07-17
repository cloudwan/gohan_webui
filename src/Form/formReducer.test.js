/* global it, describe */
import chai from 'chai';

import * as actionTypes from './FormActionTypes';
import formReducer from './formReducer';

chai.should();

describe('formReducer', () => {
  it('should return initial state', () => {
    formReducer(undefined, {}).should.deep.equal({
      forms: {}
    });

    formReducer({
      forms: {
        foo: {
          isLoading: false
        }
      }
    }, {}).should.deep.equal({
      forms: {
        foo: {
          isLoading: false
        }
      }
    });
  });

  describe(`${actionTypes.PREPARE_SCHEMA_SUCCESS}`, () => {
    it(`should handle ${actionTypes.PREPARE_SCHEMA_SUCCESS} with create specific form entry`, () => {
      formReducer(undefined, {
        type: actionTypes.PREPARE_SCHEMA_SUCCESS,
        formName: 'foo',
        data: {
          schema: {
            bar: {
              properties: {
                baz: {}
              },
              propertiesOrder: ['baz'],
              type: 'object'
            }
          }
        }
      }).should.deep.equal({
        forms: {
          foo: {
            isLoading: false,
            error: '',
            schema: {
              bar: {
                properties: {
                  baz: {}
                },
                propertiesOrder: ['baz'],
                type: 'object'
              }
            },
            formData: {}
          }
        }
      });
    });

    it(`should handle ${actionTypes.PREPARE_SCHEMA_SUCCESS} with update existing form entry`, () => {
      formReducer({
        forms: {
          foo: {
            schema: {
              bar: {
                properties: {
                  baz: {}
                },
                propertiesOrder: ['baz'],
                type: 'object'
              }
            },
            formData: {}
          }
        }
      }, {
        type: actionTypes.PREPARE_SCHEMA_SUCCESS,
        formName: 'foo',
        data: {
          formData: {
            bar: 'value'
          }
        }
      }).should.deep.equal({
        forms: {
          foo: {
            isLoading: false,
            error: '',
            schema: {
              bar: {
                properties: {
                  baz: {}
                },
                propertiesOrder: ['baz'],
                type: 'object'
              }
            },
            formData: {
              bar: 'value'
            }
          }
        }
      });
    });

    it(`should handle ${actionTypes.PREPARE_SCHEMA_SUCCESS} with adding a new form entry`, () => {
      formReducer({
        forms: {
          foo: {
            schema: {
              bar: {
                properties: {
                  baz: {}
                },
                propertiesOrder: ['baz'],
                type: 'object'
              }
            },
            formData: {}
          }
        }
      }, {
        type: actionTypes.PREPARE_SCHEMA_SUCCESS,
        formName: 'baz',
        data: {
          schema: {
            bar: {
              properties: {
                baz: {}
              },
              propertiesOrder: ['baz'],
              type: 'object'
            }
          }
        }
      }).should.deep.equal({
        forms: {
          foo: {
            schema: {
              bar: {
                properties: {
                  baz: {}
                },
                propertiesOrder: ['baz'],
                type: 'object'
              }
            },
            formData: {}
          },
          baz: {
            schema: {
              bar: {
                properties: {
                  baz: {}
                },
                propertiesOrder: ['baz'],
                type: 'object'
              }
            },
            formData: {},
            error: '',
            isLoading: false
          }
        }
      });
    });
  });



  it(`should handle ${actionTypes.CLEAR_FORM_DATA}`, () => {
    formReducer({
      forms: {
        foo: {
          schema: {
            bar: {
              type: 'object'
            }
          },
          formData: {
            bar: 'baz'
          },
          isLoading: false,
          error: ''
        }
      }
    }, {
      type: actionTypes.CLEAR_FORM_DATA,
      formName: 'foo'
    }).should.deep.equal({
      forms: {
        foo: {
          schema: {
            bar: {
              type: 'object'
            }
          },
          formData: {},
          isLoading: false,
          error: ''
        }
      }
    });
  });

  it(`should handle ${actionTypes.SHOW_ERROR}`, () => {
    formReducer(undefined, {
      type: actionTypes.SHOW_ERROR,
      error: 'Example error',
      formName: 'foo'
    }).should.deep.equal({
      forms: {
        foo: {
          error: 'Example error'
        }
      }
    });
  });

  it(`should handle ${actionTypes.CLEAR_ERROR}`, () => {
    formReducer({
      forms: {
        foo: {
          schema: {
            bar: {
              type: 'object'
            }
          },
          error: 'Example error'
        }
      }
    }, {
      type: actionTypes.CLEAR_ERROR,
      formName: 'foo'
    }).should.deep.equal({
      forms: {
        foo: {
          schema: {
            bar: {
              type: 'object'
            }
          },
          error: ''
        }
      }
    });
  });

  describe(actionTypes.CLEAR_ALL_FORMS_DATA, () => {
    it(`should handle ${actionTypes.CLEAR_ALL_FORMS_DATA} when empty state`, () => {
      formReducer(undefined, {
        type: actionTypes.CLEAR_ALL_FORMS_DATA
      }).should.deep.equal({
        forms: {}
      });
    });

    it(`should handle ${actionTypes.CLEAR_ALL_FORMS_DATA} when forms object contain data`, () => {
      formReducer({
        forms: {
          foo: {
            schema: {
              bar: {
                type: 'object'
              }
            }
          },
          bar: {
            schema: {
              baz: {
                type: 'object'
              }
            }
          }
        }
      },{
        type: actionTypes.CLEAR_ALL_FORMS_DATA
      }).should.deep.equal({
        forms: {}
      });
    });
  });
});
