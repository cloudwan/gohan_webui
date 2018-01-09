import {
  createSelector,
} from 'reselect';

const isLoading = state => state.apiRequestReducer.isLoading;
const response = state => state.apiRequestReducer.response;

export const checkLoading = createSelector(
  [isLoading],
  isLoading => isLoading
);

export const getApiResponse = createSelector(
  [response],
  response => response
);
