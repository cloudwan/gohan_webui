/* global it, describe */
import chai from 'chai';
import createRoutes, {getParents, getComponent} from './createRoutes';

const should = chai.should();

describe('createRoutes ', () => {
  describe('getParents()', () => {
    it('should return parents list', () => {
      const schemas = [
        {
          id: 'foo'
        },
        {
          id: 'bar',
          parent: 'foo'
        },
        {
          id: 'baz',
          parent: 'bar'
        },
        {
          id: 'qux'
        },
        {
          id: 'quux'
        }
      ];
      const schema = {
        id: 'qux',
        parent: 'baz'
      };
      getParents(schemas, schema).should.deep.equal([
        {
          id: 'baz',
          parent: 'bar'
        },
        {
          id: 'bar',
          parent: 'foo'
        },
        {
          id: 'foo'
        }
      ]);

    });
  });

  describe('getComponent() ', () => {
    it('should return undefined', () => {
      const route = {
        viewClass: 'qux'
      };
      const components = {
        foo: {
          id: 'foo'
        },
        bar: {
          id: 'bar',
          onEnter: 'function onEnter',
          onLeave: 'function onLeave'
        }
      };

      should.not.exist(getComponent(components, route));
      should.not.exist(getComponent());
      should.not.exist(getComponent({}));
      should.not.exist(getComponent(undefined, {}));
    });

    it('should return correct component', () => {
      const route1 = {
        viewClass: 'foo'
      };
      const route2 = {
        viewClass: 'bar'
      };

      const components = {
        foo: {
          id: 'foo'
        },
        bar: {
          id: 'bar',
          onEnter: 'function onEnter',
          onLeave: 'function onLeave'
        }
      };

      getComponent(components, route1).component.should.deep.equal({
        id: 'foo'
      });

      getComponent(components, route2).component.should.deep.equal({
        id: 'bar',
        onEnter: 'function onEnter',
        onLeave: 'function onLeave'
      });

    });

  });

  describe('createRoutes() ', () => {
    it('should return one route', () => {
      const components = {
        foo: {
          id: 'foo'
        },
        bar: {
          id: 'bar',
          onEnter: 'function onEnter',
          onLeave: 'function onLeave'
        }
      };
      const state = {
        getState: () => {
          return {
            configReducer: {
              routes: []
            },
            schemaReducer: {
              data: []
            }

          };
        }
      };
      const result = createRoutes(state, components);

      result.should.length(1);
      result[0].should.have.property('path').and.equal('/');
      result[0].should.have.property('component');
      result[0].should.have.property('childRoutes');
    });

    it('should return correct routes', () => {
      const components = {
        foo: {
          id: 'foo'
        },
        bar: {
          id: 'bar',
          onEnter: 'function onEnter',
          onLeave: 'function onLeave'
        }
      };
      const state = {
        getState: () => {
          return {
            configReducer: {
              routes: [{
                path: '/foo/bar/baz',
                viewClass: 'foo'
              }]
            },
            schemaReducer: {
              data: [
                {
                  id: 'qux',
                  url: '/v1.0/qux',
                  singular: 'qux',
                  plural: 'quxs'
                },
                {
                  id: 'quux',
                  url: '/v1.0/quux',
                  singular: 'quux',
                  plural: 'quuxs',
                  parent: 'qux'
                },
                {
                  id: 'quuz',
                  url: '/v1.0/quuz',
                  singular: 'quuz',
                  plural: 'quuzs',
                  parent: 'quux'
                },
                {
                  id: 'corge',
                  url: '/v1.0/corge',
                  singular: 'corge',
                  plural: 'corges',
                  parent: 'quuz'
                }
              ]
            }

          };
        }
      };
      const result = createRoutes(state, components);
      result[0].childRoutes.should.length(7);
    });

  });
});
