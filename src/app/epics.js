import {combineEpics} from 'redux-observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import AuthEpics from './../auth/AuthEpics';
import ApiRequestEpics from '../apiRequest/ApiRequestEpics';
import BreadcrumbEpics from '../breadcrumb/breadcrumbEpics';
import DetailEpics from '../DetailView/DetailEpics';
import CustomActionsEpic from '../CustomActions/CustomActionsEpics';

const epic$ = new BehaviorSubject(combineEpics(
  AuthEpics,
  ApiRequestEpics,
  BreadcrumbEpics,
  DetailEpics,
  CustomActionsEpic
));

export const rootEpic = (action$, store) =>
  epic$.mergeMap(epic =>
    epic(action$, store)
  );

export const injectEpic = (store, {key, epic}) => {
  if (store.asyncEpics[key] === epic) {
    return;
  }

  store.asyncEpics[key] = epic;
  epic$.next(epic);
};
