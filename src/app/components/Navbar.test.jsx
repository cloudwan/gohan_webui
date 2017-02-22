/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';
import {Popover} from '@blueprintjs/core';

import Navbar from './Navbar';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< Navbar />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <Navbar activeTenant="demo" tenants={[{name: 'demo', id: '1'}]}
        userName="admin" onRequestChangeTenant={() => {}}
        onRequestLogout={() => {}} onToggleSidebar={() => {}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should render correctly user name, active tenant and tenants list', () => {
    const userName = 'testUserName';
    const activeTenant = 'testTenantName';
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
      <Navbar activeTenant={activeTenant} tenants={tenants}
        userName={userName} onRequestChangeTenant={() => {}}
        onRequestLogout={() => {}} onToggleSidebar={() => {}}
      />
    );

    wrapper.find('.pt-icon-user').node.props.children.should.equal(userName);
    wrapper.find('.pt-icon-projects').node.props.children.should.equal(activeTenant);
    wrapper.find(Popover).node.props.content.props.children.length.should.equal(3);
  });

  it('should call onRequestLogout callback', () => {
    const userName = 'testUserName';
    const activeTenant = 'testTenantName';
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
    const handleRequestLogout = chai.spy();

    const wrapper = shallow(
      <Navbar activeTenant={activeTenant} tenants={tenants}
        userName={userName} onRequestChangeTenant={() => {}}
        onRequestLogout={handleRequestLogout} onToggleSidebar={() => {}}
      />
    );

    wrapper.find('.pt-icon-log-out').simulate('click');
    handleRequestLogout.should.called();
  });

  it('should call handleToggleSidebar callback', () => {
    const userName = 'testUserName';
    const activeTenant = 'testTenantName';
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

    const wrapper = shallow(
      <Navbar activeTenant={activeTenant} tenants={tenants}
        userName={userName} onRequestChangeTenant={() => {}}
        onRequestLogout={() => {}} onToggleSidebar={handleToggleSidebar}
      />
    );

    wrapper.find('Button').at(0).simulate('click');
    handleToggleSidebar.should.called();
  });

  it('should call handleRequestChangeTenant callback', () => {
    const userName = 'testUserName';
    const activeTenant = 'testTenantName';
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
    const handleRequestChangeTenant = chai.spy();

    const wrapper = shallow(
      <Navbar activeTenant={activeTenant} tenants={tenants}
        userName={userName} onRequestChangeTenant={handleRequestChangeTenant}
        onRequestLogout={() => {}} onToggleSidebar={() => {}}
      />
    );

    wrapper.find(Popover).node.props.content.props.children[0].props.onClick();
    handleRequestChangeTenant.should.called();
  });
});
