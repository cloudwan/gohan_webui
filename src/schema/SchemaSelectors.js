import {createSelector} from 'reselect';

const schemas = (state) => state.schemaReducer.data;
const schema = (state, id) => state.schemaReducer.data.find(item => item.id === id);

export const getSidebarMenuItems = createSelector(
  [schemas],
  (schemas) => {
    if (schemas !== undefined && Array.isArray(schemas)) {
      return schemas.filter(item => (!item.parent && item.metadata.type !== 'metaschema')).map(item => (
        {
          title: item.title,
          path: '#' + item.url
        }
      ));
    }
    return [];
  }
);

export const getSchema = createSelector(
  [schema],
  (schema) => {
    return schema;
  }
);
