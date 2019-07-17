/* global it, describe */

import chai from 'chai';

import * as selectors from './FormSelectors';

const should = chai.should();

describe('FormSelectors', () => {
  describe('getForm() husker', () => {
    it('should return object with an error and isLoading with false value', () => {
      selectors.getForm({
        formReducer: {
          forms: {}
        }
      }, 'foo').should.deep.equal({
        error: 'Form wasn\'t initialized properly',
        isLoading: false,
        schema: {},
        formData: {}
      });
    });
  });

  describe('getLoadingState()', () => {
    it('should return true for particular form', () => {
      selectors.getLoadingState({
        formReducer: {
          forms: {
            foo: {
              isLoading: true
            }
          }
        }
      }, 'foo').should.equal(true);
    });

    it('should return false for particular form', () => {
      selectors.getLoadingState({
        formReducer: {
          forms: {
            foo: {
              isLoading: false
            }
          }
        }
      }, 'foo').should.equal(false);
    });

    it('should return undefined when no isLoading property in particular form', () => {
      should.not.exist(selectors.getLoadingState({
        formReducer: {
          forms: {
            foo: {}
          }
        }
      }, 'foo'));
    });

    it('should return false when no particular form available', () => {
      selectors.getLoadingState({
        formReducer: {
          forms: {}
        }
      }).should.equal(false);
    });
  });

  describe('getSchema()', () => {
    it('should return proper schema when form exists', () => {
      selectors.getSchema({
        formReducer: {
          forms: {
            foo: {
              schema: {
                bar: {
                  type: 'object'
                }
              }
            }
          }
        }
      }, 'foo').should.deep.equal({
        bar: {
          type: 'object'
        }
      });
    });

    it('should return an empty object when schema does not exist in particular form', () => {
      selectors.getSchema({
        formReducer: {
          forms: {
            foo: {}
          }
        }
      }).should.deep.equal({});
    });

    it('should return an empty object when form does not exist', () => {
      selectors.getSchema({
        formReducer: {
          forms: {}
        }
      }).should.deep.equal({});
    });
  });

  describe('getError()', () => {
    it('should return an error property', () => {
      selectors.getError({
        formReducer: {
          forms: {
            foo: {
              error: 'baz'
            }
          }
        }
      }, 'foo').should.equal('baz');
    });

    it('should return a default error string when no form', () => {
      selectors.getError({
        formReducer: {
          forms: {}
        }
      }, 'foo').should.equal('Form wasn\'t initialized properly');
    });
  });
});
