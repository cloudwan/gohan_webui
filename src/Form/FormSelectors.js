import {createSelector} from 'reselect';

const nonExistentForm = {error: 'Form wasn\'t initialized properly', schema: {}, formData: {}, isLoading: false};
export const getForm = (state, formName) => state.formReducer.forms[formName] || nonExistentForm;

const isLoading = (state, formName) => getForm(state, formName).isLoading;
const schema = (state, formName) => getForm(state, formName).schema;
const error = (state, formName) => getForm(state, formName).error;

export const getLoadingState = createSelector(
  [isLoading],
  isLoading => isLoading
);

export const getSchema = createSelector(
  [schema],
  schema => schema
);

export const getError = createSelector(
  [error],
  error => error
);
