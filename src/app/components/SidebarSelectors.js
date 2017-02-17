import {createSelector} from 'reselect';

const schemaReducer = (state) => state.schemaReducer.data;
const sidebarConfig = (state) => state.configReducer.sidebar;

export const getSidebarMenuItems = createSelector(
  [schemaReducer, sidebarConfig],
  (schemas, sidebarConfig) => {
    const menuItems = [];

    if (sidebarConfig !== undefined) {
      sidebarConfig.reduce((result, item) => {
        result.push(
          {
            index: result.length,
            title: item.title,
            path: '#/' + item.path
          }
        );
        return result;
      }, menuItems);
    }

    if (schemas !== undefined) {
      schemas.reduce((result, item) => {
        if (!item.parent && item.metadata.type !== 'metaschema') {
          result.push(
            {
              index: menuItems.length,
              title: item.title,
              path: '#' + item.url
            }
          );
        }
        return result;
      }, menuItems);
    }

    return menuItems;
  }
);
