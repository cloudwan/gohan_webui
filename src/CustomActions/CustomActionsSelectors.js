import {
  createSelector,
} from 'reselect';
import {plain as formatJson} from 'format-json';

const result = state => formatJson(state.customActionReducer.result);

export const getActionResult = createSelector(
  [result],
  result => result || ''
);
