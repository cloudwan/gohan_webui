import {TestScheduler} from 'rxjs';
import chai from 'chai';

const expectFuctionReturnObservable = (func, args, response, expected) => {
  const testScheduler = new TestScheduler(chai.assert.deepEqual);
  const response$ = testScheduler.createColdObservable(...response);
  const call = () => response$;
  const test$ = func(...args, call);

  testScheduler.expectObservable(test$).toBe(...expected);
  testScheduler.flush();
};

export default expectFuctionReturnObservable;
