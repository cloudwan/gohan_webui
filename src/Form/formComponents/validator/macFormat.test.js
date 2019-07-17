/* global it, describe */
import chai from 'chai';

import macFormat from './macFormat';

chai.should();


describe('macFormat', () => {
  it('should return true for empty string', () => {
    const testValue = '';

    macFormat(testValue).should.equal(true);
  });

  it('should return true for correct mac address eg.(ff:aa:aa:11:05:ff)', () => {
    const testValue1 = 'ff:aa:aa:11:05:ff';
    const testValue2 = '00:00:00:00:00:00';
    const testValue3 = 'ff:ff:ff:ff:ff:ff';

    macFormat(testValue1).should.equal(true);
    macFormat(testValue2).should.equal(true);
    macFormat(testValue3).should.equal(true);
  });

  it('should return false for wrong mac address eg.(ff:aa:aa:11:05:hh)', () => {
    const testValue1 = 'ff:aa:aa:11:05:hh';
    const testValue2 = 'error';
    const testValue3 = 'ff:aa:aa:11:05';
    const testValue4 = '8.8.8.8';

    macFormat(testValue1).should.equal(false);
    macFormat(testValue2).should.equal(false);
    macFormat(testValue3).should.equal(false);
    macFormat(testValue4).should.equal(false);
  });
});
