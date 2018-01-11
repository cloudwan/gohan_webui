import {createSelector} from 'reselect';

const error = state => state.errorReducer;

export const getError = createSelector(
  [error],
  error => error
);
