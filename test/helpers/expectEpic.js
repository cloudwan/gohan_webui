import Rx from 'rxjs';
import {ActionsObservable} from 'redux-observable';
import chai from 'chai';

chai.should();

const expectEpic = (epic, {expected, action, response, store}) => {
  const testScheduler = new Rx.TestScheduler((actual, expected) => {
    actual.should.deep.equal(expected);
  });

  const action$ = new ActionsObservable(
    testScheduler.createHotObservable(...action)
  );
  const responseSubs = '^!';
  const response$ = testScheduler.createColdObservable(...response);
  const call = () => response$;

  const test$ = epic(action$, store, call);

  testScheduler.expectObservable(test$).toBe(...expected);
  testScheduler.flush();

  testScheduler.expectSubscriptions(response$.subscriptions).toBe(responseSubs);
};

export default expectEpic;
