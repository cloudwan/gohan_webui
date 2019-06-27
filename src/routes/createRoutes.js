import React, {Component} from 'react';

import {getTableView} from '../TableView';
import {getDetailView} from '../DetailView';
import {Route, Switch} from 'react-router-dom';

/**
 * Returns component.
 *
 * @param components {Object} - Dictionary of components
 * @param viewClass {string}
 * @return {React.Component}
 */
export const getComponent = (components = {}, viewClass = '') => {
  const component = components[viewClass];
  if (component === undefined) {
    console.error(`Cannot select ${viewClass} component! Check config.json!`);
    return;
  }

  return component;
};

const getIndexRouteWrapper = Comp => class IndexRoute extends Component {
  render() {
    return Comp;
  }
};

const getNestedRoute = (schema, schemas, components, path) => {
  const childrenSchemas = schema.children.map(child => schemas.find(item => item.id === child));
  const Detail = getDetailView(schema, components.Detail);

  return getIndexRouteWrapper(
    <Switch>
      {childrenSchemas.map(childSchema => {
        const nestedPath = `${path}/${childSchema.plural}/:${childSchema.id}_id`;

        return (
          <Route key={childSchema.id}
            path={nestedPath}
            component={getNestedRoute(childSchema, schemas, components, nestedPath)}
          />
        );
      })}
      <Route path={''}
        component={props => (
          <div>
            <Detail {...props}/>
            {childrenSchemas.map(childSchema => {
              const TableView = getTableView(childSchema, components.Table, true);
              return <TableView key={childSchema.id} {...props}/>;
            })}
          </div>
        )}
      />
    </Switch>
  );
};

export const createRoutes = (store, components) => {
  const {routes, sidebarChildResources = []} = store.getState().configReducer;
  const schemas = store.getState().schemaReducer.data;

  const schemaRoutes = schemas.reduce((result, schema) => {
    if (!schema.schema.permission.includes('read')) {
      return result;
    }

    if (sidebarChildResources.includes(schema.id) || schema.parent === '' || schema.parent === undefined) {
      const path = `${schema.prefix}/${schema.plural}`;

      if (!routes.find(item => item.path === path)) {
        const nestedPath = `${path}/:${schema.id}_id`;

        result.push(
          <Route key={result.length}
            path={path}
            component={getIndexRouteWrapper(
              <Switch>
                <Route path={nestedPath}
                  component={getNestedRoute(schema, schemas, components, nestedPath)}
                />
                <Route path={''}
                  component={getTableView(schema, components.Table)}
                />
              </Switch>
            )}
          />
        );
      }
    }
    return result;
  },
    routes.reduce((result, route, index) => {
      const component = getComponent(components, route.viewClass, store);
      result.push(
        <Route key={index}
          exact={true}
          path={`/${route.path}`}
          component={component}
        />
      );
      return result;
    }, [])
  );

  return schemaRoutes;
};

export default createRoutes;
