import {createSelector} from 'reselect';

const isLoading = state => state.dialogReducer.isLoading;
const schema = state => state.dialogReducer.schema;
const errorMessage = state => state.dialogReducer.errorMessage;
const dialog = (state, name) => state.dialogReducer.dialogs[name];
const anyDialogOpen = (state, names = []) => {
  const dialogs = state.dialogReducer.dialogs;

  return names.some(name => dialogs[name]);
};

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
  [dialog], dialog => dialog ? dialog.show : false
);

export const getAdditionalProps = createSelector(
  [dialog], dialog => dialog ? dialog.additionalProps : {}
);

export const getError = createSelector(
  [errorMessage], errorMessage => errorMessage
);

export const isAnyDialogOpen = createSelector(
  [anyDialogOpen], anyDialogOpen => anyDialogOpen
);
