import {
  createSelector,
} from 'reselect';

const result = state => state.customActionReducer.result;

export const getActionResult = createSelector(
  [result],
  result => result
);
