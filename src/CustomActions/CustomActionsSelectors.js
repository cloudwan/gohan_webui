import {
  createSelector,
} from 'reselect';
import jsyaml from 'js-yaml';

const result = state => jsyaml.safeDump(state.customActionReducer.result, {skipInvalid: true});

export const getActionResultYAML = createSelector(
  [result],
  result => result
);
