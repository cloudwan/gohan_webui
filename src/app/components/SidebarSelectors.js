import {createSelector} from 'reselect';

const schemaReducer = (state) => state.schemaReducer.data;

export const getSidebarMenuItems = createSelector(
  [schemaReducer], schemas => {
    const menuItems = [];

    if (schemas !== undefined) {
      schemas.forEach((item, index) => {
        if (!item.parent && item.metadata.type !== 'metaschema') {
          menuItems.push(
            {
              index,
              title: item.title,
              path: '#/' + item.plural
            }
          );
        }
      });
    }

    return menuItems;
  }
);
