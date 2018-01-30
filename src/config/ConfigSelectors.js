import {createSelector} from 'reselect';

const sidebar = state => state.configReducer.sidebar;
const gohanUrl = state => state.configReducer.gohan.url;
const title = state => state.configReducer.title;
const polling = state => state.configReducer.polling;
const pollingInterval = state => state.configReducer.pollingInterval;
const pageLimit = state => state.configReducer.pageLimit;
const followableRelations = state => state.configReducer.followableRelations;
const tableDefaultSortKey = state => state.configReducer.tableDefaultSortKey;
const tableDefaultSortOrder = state => state.configReducer.tableDefaultSortOrder;

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

export const getTitle = createSelector(
  [title],
  title => title
);

export const isPolling = createSelector(
  [polling],
  polling => Boolean(polling)
);

export const getPollingInterval = createSelector(
  [pollingInterval],
  pollingInterval => pollingInterval || 2147483647 // 32 bit int 0x7FFFFFFF
);

export const getPageLimit = createSelector(
  [pageLimit],
  pageLimit => pageLimit || 0
);

export const getDefaultSortKey = createSelector(
  [tableDefaultSortKey],
  tableDefaultSortKey => tableDefaultSortKey
);
export const getDefaultSortOrder = createSelector(
  [tableDefaultSortOrder],
  tableDefaultSortOrder => tableDefaultSortOrder
);

export const getFollowableRelationsState = createSelector(
  [followableRelations],
  followableRelations => Boolean(followableRelations)
);
