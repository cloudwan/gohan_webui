/* global it, describe */
import chai from 'chai';
import * as utils from './utils';

chai.should();

describe('utils ', () => {
  describe('optionsListObject', () => {
    it('should returns array of object label and value.', () => {
      utils.optionsListObject({options: {value: 'label'}}).should.deep.equal([{value: 'value', label: 'label'}]);
      utils.optionsListObject({}).should.deep.equal([]);
    });
  });
});
