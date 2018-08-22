/* global it, describe */
import chai from 'chai';

import * as selectors from './SuccessToasterSelectors';

chai.should();

describe('DetailSelectors', () => {
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
      selectors.getData(
        {
          successToasterReducer: {}
        }
      ).should.deep.equal({});
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

    it('should return undefined for no title', () => {
      selectors.getTitle(
        {
          successToasterReducer: {}
        }
      ).should.equal('');
    });
  });
});
