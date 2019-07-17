/* global it, describe */
import chai from 'chai';

import versionConstraintFormat from './versionConstraintFormat';

chai.should();

describe('versionConstraintFormat', () => {
  it('should return true for empty string', () => {
    const testValue = '';

    versionConstraintFormat(testValue).should.equal(true);
  });

  it('should return true for particular constraints', () => {
    const testValue1 = '=1.1.1';
    const testValue2 = '>=1.1.1-abc';
    const testValue3 = '<1.1';
    const testValue4 = '1.1.1';

    versionConstraintFormat(testValue1).should.equal(true);
    versionConstraintFormat(testValue2).should.equal(true);
    versionConstraintFormat(testValue3).should.equal(true);
    versionConstraintFormat(testValue4).should.equal(true);
  });

  it('should return false for improper string', () => {
    const testValue = '>abc';

    versionConstraintFormat(testValue).should.equal(false);
  });
});
