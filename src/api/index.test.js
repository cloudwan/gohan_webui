/* global it, describe, afterEach */
import chai from 'chai';
import Ajax from 'rxjs/observable/dom/ajax';

import * as api from './index';

chai.should();

const _ajax = Ajax.ajax;

describe('API', () => {
  afterEach(() => {
    // noinspection JSAnnotator
    Ajax.ajax = _ajax;
  });

  describe('get()', () => {
    it('should calls RxJS ajax method with appropriate params', () => {
      // noinspection JSAnnotator
      Ajax.ajax = options => {
        options.method.should.equal('GET');
        options.url.should.equal('http://sample.url');
        options.headers.should.equal('headers');
      };
      api.get('http://sample.url', 'headers');
    });
  });

  describe('post()', () => {
    it('should calls RxJS ajax method with appropriate params', () => {
      // noinspection JSAnnotator
      Ajax.ajax = options => {
        options.method.should.equal('POST');
        options.url.should.equal('http://sample.url');
        options.headers.should.equal('headers');
        options.body.should.equal('body');
      };
      api.post('http://sample.url', 'headers', 'body');
    });
  });

  describe('put()', () => {
    it('should calls RxJS ajax method with appropriate params', () => {
      // noinspection JSAnnotator
      Ajax.ajax = options => {
        options.method.should.equal('PUT');
        options.url.should.equal('http://sample.url');
        options.headers.should.equal('headers');
        options.body.should.equal('body');
      };
      api.put('http://sample.url', 'headers', 'body');
    });
  });

  describe('purge()', () => {
    it('should calls RxJS ajax method with appropriate params', () => {
      // noinspection JSAnnotator
      Ajax.ajax = options => {
        options.method.should.equal('DELETE');
        options.url.should.equal('http://sample.url');
        options.headers.should.equal('headers');
      };
      api.purge('http://sample.url', 'headers');
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
