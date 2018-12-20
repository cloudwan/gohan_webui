/* global it, describe */
import chai from 'chai';

import * as selectors from './AuthSelectors';

chai.should();

describe('AuthSelectors', () => {
  describe('isUserAdmin', () => {
    it('should return true if user is an admin', () => {
      selectors.isUserAdmin(
        {
          authReducer: {
            roles: [{name: 'admin'}, {name: 'Member'}]
          }
        }
      ).should.equal(true);
    });

    it('should return false if user isn\'t an admin', () => {
      selectors.isUserAdmin(
        {
          authReducer: {
            roles: [{name: 'Member'}]
          }
        }
      ).should.equal(false);
    });
  });

  describe('getDomains', () => {
    it('should return domains list', () => {
      selectors.getDomains({
        authReducer: {
          domains: [{name: 'testDomain1'}, {name: 'testDomain2'}]
        }
      }).should.deep.equal([
        {name: 'testDomain1'},
        {name: 'testDomain2'}
      ]);
    });
  });

  describe('getTenantsByDomain', () => {
    it('should return object with tenants grouped by domain', () => {
      selectors.getTenantsByDomain({
        authReducer: {
          domains: [
            {name: 'testDomainName1', id: 'testDomainId1'},
            {name: 'testDomainName2', id: 'testDomainId2'},
          ],
          tenants: [
            {name: 'testProject1', domain_id: 'testDomainId1'}, // eslint-disable-line camelcase
            {name: 'testProject2', domain_id: 'testDomainId2'}, // eslint-disable-line camelcase
            {name: 'testProject3', domain_id: 'testDomainId1'}, // eslint-disable-line camelcase
          ],
        }
      }).should.deep.equal({
        testDomainId1: {
          name: 'testDomainName1',
          tenants: [
            {name: 'testProject1', domain_id: 'testDomainId1'}, // eslint-disable-line camelcase
            {name: 'testProject3', domain_id: 'testDomainId1'}, // eslint-disable-line camelcase
          ]
        },
        testDomainId2: {
          name: 'testDomainName2',
          tenants: [
            {name: 'testProject2', domain_id: 'testDomainId2'}, // eslint-disable-line camelcase
          ]
        }
      });
    });

    it('should return object with tenants grouped by domain (single domain - member case)', () => {
      selectors.getTenantsByDomain({
        authReducer: {
          tenants: [
            {name: 'testProject1', domain_id: 'testDomainId1'}, // eslint-disable-line camelcase
            {name: 'testProject2', domain_id: 'testDomainId1'}, // eslint-disable-line camelcase
          ],
        }
      }).should.deep.equal({
        testDomainId1: {
          tenants: [
            {name: 'testProject1', domain_id: 'testDomainId1'}, // eslint-disable-line camelcase
            {name: 'testProject2', domain_id: 'testDomainId1'}, // eslint-disable-line camelcase
          ]
        },
      });
    });
  });
});
