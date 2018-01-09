import {createSelector} from 'reselect';

const pathname = state => state.locationReducer.pathname;

export const getPathname = createSelector(
  [pathname],
  pathname => pathname
);
