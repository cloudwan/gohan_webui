import {createSelector} from 'reselect';

const isLoading = state => state.dialogReducer.isLoading;
const schema = state => state.dialogReducer.schema;
const errorMessage = state => state.dialogReducer.errorMessage;
const dialog = (state, name) => state.dialogReducer.dialogs[name];

/**
 * Returns loading state selector.
 *
 * @type {Reselect.Selector<TInput, TOutput>}
 */
export const getLoadingState = createSelector(
  [isLoading],
  isLoading => {
    return Boolean(isLoading);
  }
);

export const getSchema = createSelector(
  [schema],
  schema => {
    return schema;
  }
);

export const isOpen = createSelector(
  [dialog], dialog => Boolean(dialog)
);

export const getError = createSelector(
  [errorMessage], errorMessage => errorMessage
);
