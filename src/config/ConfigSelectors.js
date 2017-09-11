import {createSelector} from 'reselect';

const sidebar = state => state.configReducer.sidebar;
const gohanUrl = state => state.configReducer.gohan.url;

export const getSidebar = createSelector(
  [sidebar],
  sidebar => {
    if (sidebar !== undefined && Array.isArray(sidebar)) {
      return sidebar.map(item => (
        {
          title: item.title,
          path: '#/' + item.path
        }
      ));
    }

    return [];
  }
);

export const getGohanUrl = createSelector(
  [gohanUrl],
  gohanUrl => gohanUrl
);
