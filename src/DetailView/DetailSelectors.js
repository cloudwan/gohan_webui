import {
  createSelector,
} from 'reselect';

const isLoading = state => state.detailReducer.isLoading;
const data = state => state.detailReducer.data;

export const checkLoading = createSelector(
  [isLoading],
  isLoading => isLoading
);

export const getData = createSelector(
  [data],
  data => data || {}
);
