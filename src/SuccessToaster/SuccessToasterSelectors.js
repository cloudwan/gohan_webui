import {
  createSelector,
} from 'reselect';

const data = state => state.successToasterReducer.data || {};
const title = state => state.successToasterReducer.title || '';

export const getData = createSelector(
  [data],
  data => data
);

export const getTitle = createSelector(
  [title],
  title => title
);
