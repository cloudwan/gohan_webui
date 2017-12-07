/* global it, describe */
import chai from 'chai';

import cidrFormat from './cidrFormat';

chai.should();


describe('cidrFormat', () => {
  it('should return true for empty string', () => {
    const testValue = '';

    cidrFormat(testValue).should.equal(true);
  });

  it('should return true for ipV4 eg.(168.21.11.0/24)', () => {
    const testValue1 = '168.21.11.0/24';
    const testValue2 = '255.255.255.255/32';
    const testValue3 = '0.0.0.0/0';

    cidrFormat(testValue1).should.equal(true);
    cidrFormat(testValue2).should.equal(true);
    cidrFormat(testValue3).should.equal(true);
  });

  it('should return false for ipV4 eg.(257.21.11.0/33)', () => {
    const testValue1 = '257.21.11.0/33';
    const testValue2 = '255.255.255.256/32';
    const testValue3 = '0.0.0.0/-10';
    const testValue4 = '8.8.8.8';

    cidrFormat(testValue1).should.equal(false);
    cidrFormat(testValue2).should.equal(false);
    cidrFormat(testValue3).should.equal(false);
    cidrFormat(testValue4).should.equal(false);
  });


  it('should return true for ipV6 eg.(2001:0db8:0a0b:12f0:0000:0000:0000:0001/24)', () => {
    const testValue1 = '2001:c10f:fac1:12f0:0000:0000:0000:0001/24';
    const testValue2 = '2001:0db8:0a0b::ba90:0000:0000:0001/128';
    const testValue3 = '::/0';

    cidrFormat(testValue1).should.equal(true);
    cidrFormat(testValue2).should.equal(true);
    cidrFormat(testValue3).should.equal(true);
  });

  it('should return false for ipV6 eg.(2001:0db8:::ba90:0000:0000::/129)', () => {
    const testValue1 = '2001:c10f:fac1:12f0:0000:0000:0000:0001/-10';
    const testValue2 = '2001:0db8:::ba90:0000:0000::/129';
    const testValue3 = '2001:ffff:bbbb:12f0:0000:0000:0000:0001';
    const testValue4 = '2001:/128';

    cidrFormat(testValue1).should.equal(false);
    cidrFormat(testValue2).should.equal(false);
    cidrFormat(testValue3).should.equal(false);
    cidrFormat(testValue4).should.equal(false);
  });
});
