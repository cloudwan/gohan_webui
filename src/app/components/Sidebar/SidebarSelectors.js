import {createSelector} from 'reselect';

const schemas = state => state.schemaReducer.data;
const sidebar = state => state.configReducer.sidebar;

export const getSidebarItems = createSelector(
  [schemas, sidebar],
  (schemas, sidebar) => {
    const result = [];

    if (schemas !== undefined && Array.isArray(schemas)) {
      result.push(
        ...schemas
          .filter(item => (!item.parent && item.metadata.type !== 'metaschema'))
          .map(item => (
            {
              title: item.title,
              path: '#' + item.url
            }
          ))
      );
    }

    if (sidebar !== undefined && Array.isArray(sidebar)) {
      result.push(
        ...sidebar.map(item => (
          {
            title: item.title,
            path: '#/' + item.path
          }
          ))
      );
    }

    return result;
  }
);
