import {createSelector} from 'reselect';

const breadcrumb = state => {
  if (state.breadcrumbReducer && state.breadcrumbReducer.data) {
    return state.breadcrumbReducer.data;
  }

  return [];
};

export const getBreadcrumbContent = createSelector(
  [breadcrumb],
  breadcrumb => breadcrumb
);
