import {combineEpics} from 'redux-observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const epic$ = new BehaviorSubject(combineEpics());

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
