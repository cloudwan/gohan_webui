/* global it, describe */
import chai from 'chai';

import uuidFormat from './uuidFormat';

chai.should();


describe('macFormat', () => {
  it('should return true for empty string', () => {
    const testValue = '';

    uuidFormat(testValue).should.equal(true);
  });

  it('should return true for correct uuid eg.(113f38cd-a0d6-4408-9a2c-344954f34953', () => {
    const testValue1 = '113f38cd-a0d6-4408-9a2c-344954f34953';
    const testValue2 = '11111111-a0d6-4408-9a2c-344954f34953';
    const testValue3 = '113f38cd-ffff-4408-9a2c-344954f34953';

    uuidFormat(testValue1).should.equal(true);
    uuidFormat(testValue2).should.equal(true);
    uuidFormat(testValue3).should.equal(true);
  });

  it('should return false for uuid eg.(gggggggg-a0d6-4408-9a2c-344954f34953)', () => {
    const testValue1 = '113f38cd-4408-9a2c-344954f34953';
    const testValue2 = 'gggggggg-a0d6-4408-9a2c-344954f34953';
    const testValue3 = '113f38cd-344954f34953';
    const testValue4 = 'sample-value';

    uuidFormat(testValue1).should.equal(false);
    uuidFormat(testValue2).should.equal(false);
    uuidFormat(testValue3).should.equal(false);
    uuidFormat(testValue4).should.equal(false);
  });
});
