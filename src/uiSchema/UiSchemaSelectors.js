import {createSelector} from 'reselect';

/**
 * Returns schema for specified id.
 * @param {object} state
 * @param {string} id
 */
const schema = (state, id) => state.uiSchemaReducer.data.find(item => item.id === id);

export const getUiSchema = createSelector(
  [schema],
  schema => schema
);
