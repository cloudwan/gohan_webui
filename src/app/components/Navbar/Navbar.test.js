/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

import {Navbar} from './Navbar';
import Button from '../../../components/Button';

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
    wrapper.find(Button).findWhere(item => item.props().iconName === 'user').props().text.should.equal(userName);
    wrapper.find(Button).findWhere(item => item.props().iconName === 'projects').props().text.should.equal(tenant);
  });

  it('should render correct icon and call onToggleSidebar callback', () => {
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
    const handleToggleSidebar = chai.spy();

    const wrapperDialogClosed = shallow(
      <Navbar userName={userName}
        tenant={tenant}
        tenants={tenants}
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={false}
      />
    );
    const wrapperDialogOpened = shallow(
      <Navbar userName={userName}
        tenant={tenant}
        tenants={tenants}
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={true}
      />
    );
    wrapperDialogClosed.find(Button).findWhere(item => item.props().iconName === 'menu-open').length.should.equal(1);
    wrapperDialogClosed.find(Button).findWhere(item => item.props().iconName === 'menu-close').length.should.equal(0);
    wrapperDialogClosed.find(Button).findWhere(item => item.props().iconName === 'menu-open').simulate('click');
    handleToggleSidebar.should.called();

    wrapperDialogOpened.find(Button).findWhere(item => item.props().iconName === 'menu-open').length.should.equal(0);
    wrapperDialogOpened.find(Button).findWhere(item => item.props().iconName === 'menu-closed').length.should.equal(1);
    wrapperDialogOpened.find(Button).findWhere(item => item.props().iconName === 'menu-closed').simulate('click');
    handleToggleSidebar.should.called();
  });
});