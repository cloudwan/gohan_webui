/* global it, describe */
import chai from 'chai';

import * as selectors from './SuccessToasterSelectors';

chai.should();
const should = chai.should();

describe('SuccessToasterSelectors', () => {
  describe('getData', () => {
    it('should return appropriate data', () => {
      selectors.getData(
        {
          successToasterReducer: {
            data: {foo: 'bar'}
          }
        }
      ).should.deep.equal({foo: 'bar'});
    });

    it('should return undefined for no data', () => {
      should.equal(selectors.getData({successToasterReducer: {}}), undefined);
    });
  });

  describe('getTitle', () => {
    it('should return appropriate title', () => {
      selectors.getTitle(
        {
          successToasterReducer: {
            title: 'foo'
          }
        }
      ).should.equal('foo');
    });

    it('should return empty string for no title', () => {
      selectors.getTitle(
        {
          successToasterReducer: {}
        }
      ).should.equal('');
    });
  });

  describe('getUrl', () => {
    it('should return url', () => {
      selectors.getUrl({
        successToasterReducer: {
          url: 'https://foo.bar',
        }
      }).should.equal('https://foo.bar');
    });
  });

  describe('isHtml', () => {
    it('should return true when response is html', () => {
      selectors.isHtml({
        successToasterReducer: {
          isDataHtml: true,
        }
      }).should.equal(true);
    });

    it('should return false when response isn\'t html', () => {
      selectors.isHtml({
        successToasterReducer: {
          isDataHtml: false,
        }
      }).should.equal(false);
    });
  });

  describe('getResponseFormat()', () => {
    it('should return "default" response format', () => {
      selectors.getResponseFormat({
        successToasterReducer: {
          responseFormat: 'default'
        }
      }).should.equal('default');
    });
  });
});
