import React from 'react';
import App from './../app/App';
import TableView, {onTableEnter} from '../TableView';
import DetailView, {onDetailEnter} from '../DetailView';
import NotFound from '../NotFoundView';
import requestAuth from '../auth/requestAuth';
import components from './componentsList';

/**
 * Returns parents of specified schema.
 *
 * @param schemas {Array} - Array of all schemas.
 * @param schema {Object} - Child schema
 * @return {Array}
 */
export const getParents = (schemas, schema) => {
  const result = [];
  let parentSchema = schemas.find(item => item.id === schema.parent);

  result.push(parentSchema);

  while (parentSchema.parent) {
    parentSchema = schemas.find(item => item.id === parentSchema.parent);
    result.push(parentSchema);
  }

  return result;
};

/**
 * Creates array of routes based on config.json and array of schemas.
 *
 * @param store {Object} - Store of application
 * @return {Array}
 */
export const createRoutes = store => {
  const {routes} = store.getState().configReducer;
  const schemas = store.getState().schemaReducer.data;

  const schemaRoutes = schemas.reduce((result, schema) => {
    const schemaChilds = schemas.filter(childSchema => childSchema.parent === schema.singular);

    if (schema.parent) {
      const parents = getParents(schemas, schema);
      const singularPath = `${parents.reverse().reduce((result, parent, i) => {
        if (i === 0) {
          result += parent.prefix;
        }

        result += `/${parent.plural}/:${parent.id}Id`;

        return result;
      }, '')}/${schema.plural}/:id`;
      const singular = {
        path: singularPath,
        singular: schema.singular,
        getComponent(nextState, cb) {
          let parentUrl = Object.keys(nextState.params).reduce((result, key) => {
            return result.replace(`:${key}`, nextState.params[key]);
          }, singularPath);

          return cb(
            null,
            params => {
              return (
                <div>
                  <DetailView singular={schema.singular} {...params}/>
                  {
                    schemaChilds.map(child => (
                      <TableView key={child.id} plural={child.plural}
                        parentUrl={parentUrl}
                      />
                    ))
                  }
                </div>
              );
            }
          );
        },
        onEnter: (nextState) => {
          let url = Object.keys(nextState.params).reduce((result, key) => {
            return result.replace(`:${key}`, nextState.params[key]);
          }, singularPath);

          onDetailEnter(store);
          schemaChilds.forEach(child => {
            onTableEnter(store, child.plural, nextState, url);
          });
        }
      };

      result.push(singular);
    } else {
      const singular = {
        path: `${schema.url}/:id`,
        singular: schema.singular,
        getComponent(nextState, cb) {
          return cb(
            null,
            params => {
              const parentUrl = `${schema.prefix}/${schema.plural}/${nextState.params.id}`;

              return (
                <div>
                  <DetailView singular={schema.singular} {...params}/>
                  {
                    schemaChilds.map(child => (
                      <TableView key={child.id} plural={child.plural}
                        parentUrl={parentUrl}
                      />
                    ))
                  }
                </div>
              );
            }
          );
        },
        onEnter: (nextState) => {
          const parentUrl = `${schema.prefix}/${schema.plural}/${nextState.params.id}`;

          onDetailEnter(store);
          schemaChilds.forEach(child => {
            onTableEnter(store, child.plural, nextState, parentUrl);
          });
        }
      };
      const plural = {
        path: schema.url,
        plural: schema.plural,
        getComponent(nextState, cb) {
          return cb(null,
            params => {
              const {plural} = schema;
              const {location} = params;

              return (
                <TableView location={location} plural={plural}/>
              );
            }
          );
        },
        onEnter: (nextState) => {
          onTableEnter(store, schema.plural, nextState, schema.prefix);
        }
      };
      result.push(singular, plural);
    }
    return result;
  }, []);

  const prepareRoutes = item => {
    if (Array.isArray(item.childRoutes)) {
      return item.childRoutes.map(item => {
        const childRoutes = prepareRoutes(item);
        const component = components[item.componentName];

        if (component === undefined) {
          throw new Error('Cannot select component! Check config.json!');
        }

        const result = {
          path: item.path,
          component,
        };

        if (childRoutes) {
          result.childRoutes = childRoutes;
        }

        return result;
      });
    }
  };

  return [
    {
      path: '/',
      component: requestAuth(App),
      childRoutes: [
        ...prepareRoutes(routes),
        ...schemaRoutes,
        {
          path: '*',
          component: NotFound
        }
      ]
    }
  ];
};

export default createRoutes;
