/* global it, describe */
import chai from 'chai';
import {getComponent} from './createRoutes';

const should = chai.should();

describe('createRoutes ', () => {
  describe('getComponent() ', () => {
    it('should return undefined', () => {
      const components = {
        foo: {
          id: 'foo'
        },
        bar: {
        }
      };

      should.not.exist(getComponent(components, 'baz'));
      should.not.exist(getComponent());
    });

    it('should return correct component', () => {
      const components = {
        foo: {
          id: 'foo'
        },
        bar: {
        }
      };
      getComponent(components, 'foo').should.deep.equal({
        id: 'foo'
      });

    });

  });
});
