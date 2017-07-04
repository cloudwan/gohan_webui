/* global it, describe */
import React from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow, mount} from 'enzyme';

import {Menu, MenuItem} from '@blueprintjs/core';
import ConnectedSidebarMenu, {SidebarMenu} from './SidebarMenu';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

const mockStore = configureStore();

describe('< SidebarMenu />', function () {
  const store = mockStore({
    locationReducer: {
      pathname: '/v1.0/matchingpath'
    }
  });

  it('should exist', () => {
    const wrapper = shallow(
      <SidebarMenu/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 2 divs', () => {
    const wrapper = shallow(
      <SidebarMenu/>
    );

    wrapper.find('div').should.have.length(2);
  });

  it('should contain 1 label', () => {
    const wrapper = shallow(
      <SidebarMenu/>
    );

    wrapper.find('label').should.have.length(1);
  });

  it('should contain 1 Menu', () => {
    const wrapper = shallow(
      <SidebarMenu/>
    );

    wrapper.find(Menu).should.have.length(1);
  });

  it('should contain list of 2 MenuItems', () => {
    const menuItems = [
      {
        title: 'title1',
        path: '#/plural1',
        index: 1
      },
      {
        title: 'title2',
        path: '#/plural2',
        index: 2
      }
    ];
    const wrapper = mount(
      <ConnectedSidebarMenu store={store} menuItems={menuItems}/>
    );

    wrapper.update();
    wrapper.find(MenuItem).should.have.length(2);
  });


  it('should have initial state', () => {
    const wrapper = shallow(
      <SidebarMenu/>
    );

    wrapper.state('searchQuery').should.be.equal('');
  });

  it('should call onChange when changed input value', () => {
    const onChange = chai.spy();
    const wrapper = mount(
      <SidebarMenu/>
    );

    wrapper.find('[type="text"]').get(0).onChange = onChange;
    wrapper.find('[type="text"]').simulate('change', {target: {value: 'a'}});
  });

  it('should have initial menu items when search string is empty', () => {
    const menuItems = [
      {
        title: 'title1',
        path: '#/plural1',
        index: 1
      },
      {
        title: 'title2',
        path: '#/plural2',
        index: 2
      }
    ];
    const wrapper = mount(
      <ConnectedSidebarMenu store={store} menuItems={menuItems}/>
    );

    wrapper.update();
    wrapper.find('[type="text"]').simulate('change', {target: {value: ''}});

    wrapper.find(MenuItem).should.have.length(2);
  });

  it('should have filtered menu items when search string is not empty', () => {
    const menuItems = [
      {
        title: 'title1',
        path: '#/plural1',
        index: 1
      },
      {
        title: 'title2',
        path: '#/plural2',
        index: 2
      }
    ];
    const wrapper = mount(
      <ConnectedSidebarMenu store={store} menuItems={menuItems}/>
    );

    wrapper.update();
    wrapper.find('[type="text"]').simulate('change', {target: {value: 'title2'}});

    wrapper.find(MenuItem).should.have.length(1);
  });

  it('should have 0 menu items when search string does not match any item', () => {
    const menuItems = [
      {
        title: 'title1',
        path: '#/plural1',
        index: 1
      },
      {
        title: 'title2',
        path: '#/plural2',
        index: 2
      }
    ];
    const wrapper = mount(
      <ConnectedSidebarMenu store={store} menuItems={menuItems}/>
    );

    wrapper.update();
    wrapper.find('[type="text"]').simulate('change', {target: {value: 'title4'}});

    wrapper.find(MenuItem).should.have.length(0);
  });

  it('should highlight a matching menu item', () => {
    const menuItems = [
      {
        title: 'title1',
        path: '#/plural1',
        index: 1
      },
      {
        title: 'title2',
        path: '#/v1.0/matchingpath',
        index: 2
      }
    ];
    const wrapper = mount(
      <ConnectedSidebarMenu store={store} menuItems={menuItems}/>
    );

    wrapper.update();
    wrapper.find('.pt-intent-primary').should.have.length(1);
  });

  it('should NOT highlight a matching menu item when viewing child resources', () => {
    const customStore = mockStore({
      locationReducer: {
        pathname: '/v1.0/resourcegroup/childresource/resourceid'
      }
    });
    const menuItems = [
      {
        title: 'title1',
        path: '#/plural1',
        index: 1
      },
      {
        title: 'title2',
        path: '#/v1.0/resourcegroup',
        index: 2
      }
    ];
    const wrapper = mount(
      <ConnectedSidebarMenu store={customStore} menuItems={menuItems}/>
    );

    wrapper.update();
    wrapper.find('.pt-intent-primary').should.have.length(0);
  });

  it('should highlight nothing if no path names match', () => {
    const menuItems = [
      {
        title: 'title1',
        path: '#/non_matching_path1',
        index: 1
      },
      {
        title: 'title2',
        path: '#/v1.0/non_matching_path2',
        index: 2
      }
    ];
    const wrapper = mount(
      <ConnectedSidebarMenu store={store} menuItems={menuItems}/>
    );

    wrapper.update();
    wrapper.find('.pt-intent-primary').should.have.length(0);
  });
});
