import React from 'react';
import {bindActionCreators} from 'redux';
import {onTableEnter, getTableView} from '../TableView';
import {onDetailEnter, getDetailView} from '../DetailView';
import NotFound from '../NotFoundView';
import requestAuth from '../auth/requestAuth';

import {update} from '../breadcrumb/breadcrumbActions';

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

export const getParentsWithDetails = (schemas, parents, detailIds) => {
  return parents.reverse().reduce((result, item, index) => {
    const detailId = detailIds[`${item.singular}Id`];
    const updatedElements = [];
    if (index === 0) {
      updatedElements.push({
        title: item.title,
        url: `/#${item.url}`,
      });

      if (detailId) {
        updatedElements.push({
          singular: item.singular,
          requestUrl: `${item.url}/${detailId}`,
          url: `/#${item.url}/${detailId}`,
        });
      }
    } else if ((index > 0) && detailId) {
      updatedElements.push({
        singular: item.singular,
        requestUrl: `${schemas.find(schema => item.id === schema.id).url}/${detailIds[`${item.singular}Id`]}`,
        url: `#${getParents(schemas, item).reverse().reduce((result, parent, index) => {
          const baseUrl = `${result}${(index === 0) ? parent.prefix : ''}`;
          const url = `${parent.plural}/${detailIds[`${parent.singular}Id`]}`;

          return `${baseUrl}/${url}`;
        }, '')}/${item.plural}/${detailIds[`${item.singular}Id`]}`
      });
    }

    return result.concat(updatedElements);
  }, []);
};

/**
 * Returns component with onEnter and onLeave actions.
 *
 * @param components {Object} - Array of components
 * @param route {{viewClass: string}}
 * @return {{component: React.Component, onEnter: (function | undefined), onLeave: (function | undefined)}}
 */
export const getComponent = (components, route, store = {}) => {
  if (!route || !components) {
    return;
  }

  const viewClass = route.viewClass;
  const component = components[viewClass];
  const updateBreadcrumb = bindActionCreators(update, store.dispatch);

  if (component === undefined) {
    console.error('Cannot select component! Check config.json!');
    return;
  }

  return {
    component,
    onEnter: component.onEnter ? ((...params) => {
      updateBreadcrumb([{
        title: route.name,
        url: `/#${route.path}`,
      }]);

      return component.onEnter(store, ...params);
    }) : undefined,
    onLeave: component.onLeave ? (...params) => component.onLeave(store, ...params) : undefined
  };
};

/**
 * Creates array of routes based on config.json and array of schemas.
 *
 * @param store {Object} - Store of application
 * @param components {Object} - React components
 * @return {Array}
 */
export const createRoutes = (store, components) => {
  const TableView = getTableView(components.Table);
  const DetailView = getDetailView(components.Detail);
  const {routes} = store.getState().configReducer;
  const schemas = store.getState().schemaReducer.data;
  const indexRoute = getComponent(components, routes.find(item => item.path === ''), store);
  const updateBreadcrumb = bindActionCreators(update, store.dispatch);

  const configRoutes = routes.reduce((result, route) => {
    const component = getComponent(components, route, store);
    result.push({
      path: route.path,
      ...component
    });
    return result;
  }, []);

  const schemaRoutes = schemas.reduce((result, schema) => {
    const schemaChilds = schemas.filter(childSchema => childSchema.parent === schema.singular);

    if (schema.parent) {
      const parents = getParents(schemas, schema);
      const singularPath = `${parents.reverse().reduce((result, parent, index) => {
        const baseUrl = `${result}${(index === 0) ? parent.prefix : ''}`;
        const url = `${parent.plural}/:${parent.id}Id`;

        return `${baseUrl}/${url}`;
      }, '')}/${schema.plural}/:id`;
      const singular = {
        path: singularPath,
        singular: schema.singular,
        schemaId: schema.id,
        url: schema.url,
        getComponent(nextState, cb) {
          let parentUrl = Object.keys(nextState.params).reduce((result, key) => {
            return result.replace(`:${key}`, nextState.params[key]);
          }, singularPath);

          return cb(
            null,
            params => {
              return (
                <div>
                  <DetailView singular={schema.singular}
                    schemaId={schema.id}
                    url={schema.url}
                    {...params}
                  />
                  {
                    schemaChilds.map(child => (
                      <TableView key={child.id} plural={child.plural}
                        parentUrl={parentUrl} schemaId={schema.id}
                      />
                    ))
                  }
                </div>
              );
            }
          );
        },
        onEnter: nextState => {
          let url = Object.keys(nextState.params).reduce((result, key) => {
            return result.replace(`:${key}`, nextState.params[key]);
          }, singularPath);

          updateBreadcrumb([
            ...getParentsWithDetails(
              schemas,
              getParents(schemas, schema),
              nextState.params,
            ),
            {
              singular: schema.singular,
              requestUrl: `${schema.url}/${nextState.params.id}`,
              url: `/#${url}`
            }
          ]);

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
        schemaId: schema.id,
        singular: schema.singular,
        getComponent(nextState, cb) {
          return cb(
            null,
            params => {
              const parentUrl = `${schema.prefix}/${schema.plural}/${nextState.params.id}`;

              return (
                <div>
                  <DetailView singular={schema.singular}
                    schemaId={schema.id}
                    url={schema.url}
                    {...params}
                  />
                  {
                    schemaChilds.map(child => (
                      <TableView key={child.id} plural={child.plural}
                        parentUrl={parentUrl} schemaId={child.id}
                      />
                    ))
                  }
                </div>
              );
            }
          );
        },
        onEnter: nextState => {
          const parentUrl = `${schema.prefix}/${schema.plural}/${nextState.params.id}`;

          updateBreadcrumb([
            {
              title: schema.title,
              url: `/#${schema.url}`,
            },
            {
              singular: schema.singular,
              requestUrl: `${schema.url}/${nextState.params.id}`,
              url: `/#${parentUrl}`
            }
          ]);

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
                <TableView location={location} plural={plural}
                  schemaId={schema.id}
                />
              );
            }
          );
        },
        onEnter: nextState => {
          updateBreadcrumb([{
            title: schema.title,
            url: `/#${schema.url}`,
          }]);

          onTableEnter(store, schema.plural, nextState, schema.prefix);
        }
      };
      result.push(singular, plural);
    }
    return result;
  }, []);

  return [
    {
      path: '/',
      component: requestAuth(components.App),
      indexRoute,
      childRoutes: [
        ...configRoutes,
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
