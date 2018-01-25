/* global it, describe, afterEach, beforeEach */
import chai from 'chai';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Ajax from 'rxjs/observable/dom/ajax';
import {Observable, TestScheduler} from 'rxjs';
import * as api from './index';

chai.should();
chai.use(sinonChai);

describe('API', () => {
  describe('getPollingTimer()', () => {
    let testScheduler;
    const mockStore = configureMockStore();

    beforeEach(() => {
      const originalTimer = Observable.timer;
      testScheduler = new TestScheduler((a, b) => a.should.deep.equal(b));

      sinon.stub(Observable, 'timer').callsFake((initialDelay, dueTime) =>
        originalTimer.call(this, initialDelay, dueTime, testScheduler)
      );
    });

    afterEach(() => {
      Observable.timer.restore();
    });

    it('should return timer stream with polling interval', () => {
      const store = mockStore({
        configReducer: {
          polling: true,
          pollingInterval: 10,
        }
      });

      testScheduler.schedule(() => {
        testScheduler.expectObservable(
          api.getPollingTimer(store.getState(), Observable.timer(30))
        ).toBe(
          '-abc|',
          {
            a: 0,
            b: 1,
            c: 2
          }
        );
      }, 10);
      testScheduler.flush();
    });

    it('should return timer stream without polling interval', () => {
      const store = mockStore({
        configReducer: {
          polling: false,
          pollingInterval: 10,
        }
      });

      testScheduler.schedule(() => {
        testScheduler.expectObservable(
          api.getPollingTimer(store.getState(), Observable.timer(30))
        ).toBe(
          '-a|',
          {
            a: 0
          }
        );
      }, 10);
      testScheduler.flush();
    });
  });

  describe('GetCollectionObservable()', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      schemaReducer: {
        data: [
          {
            id: 'food',
            prefix: '/v1.0',
            plural: 'foods'
          }
        ]
      },
      authReducer: {
        tokenId: 'testToken'
      },
      configReducer: {
        gohan: {
          url: 'gohan.io'
        },
        pageLimit: '66'
      }
    });

    it('should create appropriate request object with defined page limit', () => {
      const collection = new api.GetCollectionObservable(store.getState(), 'food', {}, {limit: 123});

      collection.request.url.should.equal('gohan.io/v1.0/foods?limit=123');
      collection.request.headers.should.deep.equal({
        'Content-Type': 'application/json',
        'X-Auth-Token': 'testToken'
      });
      collection.request.method.should.equal('GET');
    });

    it('should create appropriate request object without defined page limit', () => {
      const collection = new api.GetCollectionObservable(store.getState(), 'food', {});

      collection.request.url.should.equal('gohan.io/v1.0/foods?limit=66');
      collection.request.headers.should.deep.equal({
        'Content-Type': 'application/json',
        'X-Auth-Token': 'testToken'
      });
      collection.request.method.should.equal('GET');
    });
  });

  describe('GetSingularObservable()', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      schemaReducer: {
        data: [
          {
            id: 'food',
            prefix: '/v1.0',
            plural: 'foods'
          }
        ]
      },
      authReducer: {
        tokenId: 'testToken'
      },
      configReducer: {
        gohan: {
          url: 'gohan.io'
        }
      }
    });

    it('should create appropriate request object', () => {
      const collection = new api.GetSingularObservable(
        store.getState(),
        'food',
        {food_id: 'reksio'} // eslint-disable-line camelcase
      );

      collection.request.url.should.equal('gohan.io/v1.0/foods/reksio');
      collection.request.headers.should.deep.equal({
        'Content-Type': 'application/json',
        'X-Auth-Token': 'testToken'
      });
      collection.request.method.should.equal('GET');
    });
  });

  describe('get()', () => {
    let ajaxStub;

    beforeEach(() => {
      ajaxStub = sinon.stub(Ajax, 'ajax').callsFake(() => {});
    });

    afterEach(() => {
      Ajax.ajax.restore();
    });

    it('should calls RxJS ajax method with appropriate params', () => {
      api.get('http://sample.url', 'headers');

      ajaxStub.should.calledWith({
        crossDomain: true,
        headers: 'headers',
        method: 'GET',
        url: 'http://sample.url'
      });
    });
  });

  describe('post()', () => {
    let ajaxStub;

    beforeEach(() => {
      ajaxStub = sinon.stub(Ajax, 'ajax').callsFake(() => {});
    });

    afterEach(() => {
      Ajax.ajax.restore();
    });

    it('should calls RxJS ajax method with appropriate params', () => {
      api.post('http://sample.url', 'headers', 'body');

      ajaxStub.should.calledWith({
        body: 'body',
        crossDomain: true,
        headers: 'headers',
        method: 'POST',
        url: 'http://sample.url'
      });
    });
  });

  describe('put()', () => {
    let ajaxStub;

    beforeEach(() => {
      ajaxStub = sinon.stub(Ajax, 'ajax').callsFake(() => {});
    });

    afterEach(() => {
      Ajax.ajax.restore();
    });

    it('should calls RxJS ajax method with appropriate params', () => {
      api.put('http://sample.url', 'headers', 'body');

      ajaxStub.should.calledWith({
        body: 'body',
        crossDomain: true,
        headers: 'headers',
        method: 'PUT',
        url: 'http://sample.url'
      });
    });
  });

  describe('purge()', () => {
    let ajaxStub;

    beforeEach(() => {
      ajaxStub = sinon.stub(Ajax, 'ajax').callsFake(() => {});
    });

    afterEach(() => {
      Ajax.ajax.restore();
    });

    it('should calls RxJS ajax method with appropriate params', () => {
      api.purge('http://sample.url', 'headers');

      ajaxStub.should.calledWith({
        crossDomain: true,
        headers: 'headers',
        method: 'DELETE',
        url: 'http://sample.url'
      });
    });
  });

  describe('parseXHRError()', () => {
    it('should returns \'Unknown error!\' message', () => {
      api.parseXHRError().should.equal('Unknown error!');
      api.parseXHRError({data: 'Test error!'}).should.equal('Unknown error!');
      api.parseXHRError({xhr: {}}).should.equal('Unknown error!');
      api.parseXHRError({xhr: {response: 123}}).should.equal('Unknown error!');
      api.parseXHRError({xhr: {response: {}}}).should.equal('Unknown error!');
      api.parseXHRError({xhr: {response: {error: 12}}}).should.equal('Unknown error!');
      api.parseXHRError({xhr: {response: {error: {}}}}).should.equal('Unknown error!');
      api.parseXHRError({xhr: {response: {error: {message: 123}}}}).should.equal('Unknown error!');
    });

    it('should returns correct error message', () => {
      api.parseXHRError({message: 'Test error!'}).should.equal('Test error!');
    });

    it('should returns error message from xhr object', () => {
      api.parseXHRError({xhr: {response: 'Error!'}}).should.equal('Error!');
      api.parseXHRError({xhr: {response: {error: 'Error!'}}}).should.equal('Error!');
      api.parseXHRError({xhr: {response: {error: {message: 'Error!'}}}}).should.equal('Error!');
    });
  });
});
