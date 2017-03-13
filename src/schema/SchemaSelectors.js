import {createSelector} from 'reselect';

const schemas = (state) => state.schemaReducer.data;

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
