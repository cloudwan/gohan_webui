/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

import {Navbar} from './Navbar';
import {Button} from '@blueprintjs/core';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< Navbar />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <Navbar tenant="demo"
        userName="admin"
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should render correctly user name, tenant', () => {
    const userName = 'testUserName';
    const tenant = 'testTenantName';
    const tenants = [
      {
        id: '10',
        name: 'sampleTenant10'
      },
      {
        id: '11',
        name: 'sampleTenant11'
      },
      {
        id: '12',
        name: 'sampleTenant12'
      }
    ];

    const wrapper = shallow(
      <Navbar tenant={tenant}
        userName={userName}
        tenants={tenants}
      />
    );

    wrapper.find(Button).findWhere(item => item.props().className === 'pt-minimal user')
      .props().children[1].should.equal(userName);
    wrapper.find(Button).findWhere(item => item.props().className === 'pt-minimal tenant')
      .props().children[1].should.equal(tenant);
  });
});
