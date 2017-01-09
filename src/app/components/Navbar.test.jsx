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
        onRequestLogout={() => {}} onRequestShowMenu={() => {}}
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
        onRequestLogout={() => {}} onRequestShowMenu={() => {}}
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
        onRequestLogout={handleRequestLogout} onRequestShowMenu={() => {}}
      />
    );

    wrapper.find('.pt-icon-log-out').simulate('click');
    handleRequestLogout.should.called();
  });

  it('should call onRequestShowMenu callback', () => {
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
    const handleRequestShowMenu = chai.spy();

    const wrapper = shallow(
      <Navbar activeTenant={activeTenant} tenants={tenants}
        userName={userName} onRequestChangeTenant={() => {}}
        onRequestLogout={() => {}} onRequestShowMenu={handleRequestShowMenu}
      />
    );

    wrapper.find('.pt-icon-menu-closed').simulate('click');
    handleRequestShowMenu.should.called();
  });

  it('should call onRequestShowMenu callback', () => {
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
        onRequestLogout={() => {}} onRequestShowMenu={() => {}}
      />
    );

    wrapper.find(Popover).node.props.content.props.children[0].props.onClick();
    handleRequestChangeTenant.should.called();
  });
});
