import {createSelector} from 'reselect';
import {difference} from 'lodash';

const schemas = state => {
  if (state.schemaReducer && state.schemaReducer.data) {
    return state.schemaReducer.data;
  }

  return [];
};

const sidebar = state => {
  if (state.configReducer && state.configReducer.sidebar) {
    return state.configReducer.sidebar;
  }

  return [];
};

const sidebarCategories = state => {
  if (state.configReducer && state.configReducer.sidebarCategories) {
    return state.configReducer.sidebarCategories;
  }

  return [];
};

const sidebarFavorites = state => {
  if (state.configReducer && state.configReducer.sidebarFavorites) {
    return state.configReducer.sidebarFavorites;
  }

  return [];
};

const getSidebarItems = (sidebar, schemas) => {
  const sidebarItems = {};

  if (schemas !== undefined && Array.isArray(schemas)) {
    schemas
      .filter(item => (!item.parent && item.metadata.type !== 'metaschema'))
      .forEach(item => {
        sidebarItems[item.id] = {
          title: item.title,
          path: '#' + item.url
        };
      });
  }

  if (sidebar !== undefined && Array.isArray(sidebar)) {
    sidebar.forEach(item => {
      sidebarItems[item.id] = {
        title: item.title,
        path: '#/' + item.path
      };
    });
  }

  return sidebarItems;
};

export const getSidebarCategories = createSelector(
  [sidebar, schemas, sidebarCategories, sidebarFavorites],
  (sidebar, schemas, sidebarCategories, sidebarFavorites) => {
    const sidebarItems = getSidebarItems(sidebar, schemas);
    const sidebarItemsIds = Object.keys(sidebarItems);
    const groupedItemsIds = sidebarCategories.reduce((ids, currentCategory) => [...ids, ...currentCategory.items], []);
    const otherItemsIds = difference(sidebarItemsIds, groupedItemsIds);

    const getItemsByIds = (ids, items) => ids
      .map(id => items[id])
      .filter(item => item !== undefined);

    return [
      {
        title: 'Favorites',
        items: getItemsByIds(sidebarFavorites, sidebarItems),
      },
      ...sidebarCategories.map(category => ({
        title: category.name,
        items: getItemsByIds(category.items, sidebarItems),
      })),
      {
        title: 'Others',
        items: getItemsByIds(otherItemsIds, sidebarItems),
      }
    ];
  }
);
