/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import {Navbar} from './Navbar';
import {Button} from '@blueprintjs/core';

chai.use(chaiEnzyme());
chai.should();

describe('< Navbar />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <Navbar tenantName="Tenant 1"
        tenantId="1"
        userName="admin"
        isAdmin={false}
        isTenantFilter={false}
        tenantsByDomain={{
          domainId1: {
            name: 'Domain 1',
            tenants: [
              {id: 'tenantId1', name: 'Tenant 1'},
              {id: 'tenantId2', name: 'Tenant 2'}
            ]
          }
        }}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should render correctly user name, tenant', () => {
    const userName = 'testUserName';
    const tenantId = 'tenantId2';
    const tenantName = 'Tenant 2';
    const tenantsByDomain = {
      domainId1: {
        name: 'Domain 1',
        tenants: [
          {id: 'tenantId1', name: 'Tenant 1'},
          {id: 'tenantId2', name: 'Tenant 2'}
        ]
      },
      domainId2: {
        name: 'Domain 2',
        tenants: [
          {id: 'tenantId3', name: 'Tenant 3'}
        ]
      }
    };


    const wrapper = shallow(
      <Navbar tenantId={tenantId}
        tenantName={tenantName}
        userName={userName}
        isAdmin={true}
        isTenantFilter={false}
        tenantsByDomain={tenantsByDomain}
      />
    );

    wrapper.find(Button).findWhere(item => item.props().className === 'pt-minimal user')
      .props().children[1].should.equal(userName);
    wrapper.find(Button).findWhere(item => item.props().className === 'pt-minimal tenant')
      .props().children[1].should.equal(tenantName);
  });
});
