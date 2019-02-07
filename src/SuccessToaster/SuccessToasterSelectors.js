import {
  createSelector,
} from 'reselect';

const data = state => state.successToasterReducer.data;
const title = state => state.successToasterReducer.title || '';
const isDataHtml = state => state.successToasterReducer.isDataHtml;
const url = state => state.successToasterReducer.url;
const responseFormat = state => state.successToasterReducer.responseFormat;

export const getData = createSelector(
  [data],
  data => data
);

export const getTitle = createSelector(
  [title],
  title => title
);

export const getUrl = createSelector(
  [url],
  url => url,
);

export const isHtml = createSelector(
  [isDataHtml],
  isDataHtml => isDataHtml
);

export const getResponseFormat = createSelector(
  [responseFormat],
  responseFormat => responseFormat
);
