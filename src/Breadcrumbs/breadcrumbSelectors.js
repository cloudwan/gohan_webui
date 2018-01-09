import {createSelector} from 'reselect';

const breadcrumb = state => {
  if (state.breadcrumbReducer && state.breadcrumbReducer.data) {
    return state.breadcrumbReducer.data;
  }

  return [];
};
const initialDocTitle = state => {
  if (state.breadcrumbReducer && state.breadcrumbReducer.initialDocTitle) {
    return state.breadcrumbReducer.initialDocTitle;
  }

  return '';
};

export const getBreadcrumbContent = createSelector(
  [breadcrumb],
  breadcrumb => breadcrumb
);

export const getInitialDocTitle = createSelector(
  [initialDocTitle],
  initialDocTitle => initialDocTitle
);
