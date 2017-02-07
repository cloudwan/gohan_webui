/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow, mount} from 'enzyme';

import {Menu, MenuItem} from '@blueprintjs/core';
import SidebarMenu from './SidebarMenu';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< SidebarMenu />', function () {
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
    const schemaReducer = {
      data: [
        {
          title: 'title1',
          plural: 'plural1',
          metadata: {
            type: 'type1'
          }
        },
        {
          title: 'title2',
          plural: 'plural2',
          metadata: {
            type: 'type2'
          }
        }
      ]
    };
    const wrapper = mount(
      <SidebarMenu schemaReducer={schemaReducer}/>
    );

    wrapper.update();
    wrapper.find(MenuItem).should.have.length(2);
  });

  it('should contain list of 2 MenuItems and omit 1 item in data array', () => {
    const schemaReducer = {
      data: [
        {
          title: 'title1',
          plural: 'plural1',
          metadata: {
            type: 'type1'
          }
        },
        {
          title: 'title2',
          plural: 'plural2',
          metadata: {
            type: 'type2'
          }
        },
        {
          title: 'title3',
          plural: 'plural3',
          metadata: {
            type: 'metaschema'
          }
        }
      ]
    };
    const wrapper = mount(
      <SidebarMenu schemaReducer={schemaReducer}/>
    );

    wrapper.update();
    wrapper.find(MenuItem).should.have.length(2);
  });

  it('should have initial state', () => {
    const wrapper = shallow(
      <SidebarMenu/>
    );

    wrapper.should.have.state('searchQuery');
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
    const schemaReducer = {
      data: [
        {
          title: 'title1',
          plural: 'plural1',
          metadata: {
            type: 'type1'
          }
        },
        {
          title: 'title2',
          plural: 'plural2',
          metadata: {
            type: 'type2'
          }
        },
        {
          title: 'title3',
          plural: 'plural3',
          metadata: {
            type: 'metaschema'
          }
        }
      ]
    };
    const wrapper = mount(
      <SidebarMenu schemaReducer={schemaReducer}/>
    );

    wrapper.update();
    wrapper.find('[type="text"]').simulate('change', {target: {value: ''}});

    wrapper.find(MenuItem).should.have.length(2);
  });

  it('should have filtered menu items when search string is not empty', () => {
    const schemaReducer = {
      data: [
        {
          title: 'title1',
          plural: 'plural1',
          metadata: {
            type: 'type1'
          }
        },
        {
          title: 'title2',
          plural: 'plural2',
          metadata: {
            type: 'type2'
          }
        },
        {
          title: 'title3',
          plural: 'plural3',
          metadata: {
            type: 'metaschema'
          }
        }
      ]
    };
    const wrapper = mount(
      <SidebarMenu schemaReducer={schemaReducer}/>
    );

    wrapper.update();
    wrapper.find('[type="text"]').simulate('change', {target: {value: 'title2'}});

    wrapper.find(MenuItem).should.have.length(1);
  });

  it('should have 0 menu items when search string does not match any item', () => {
    const schemaReducer = {
      data: [
        {
          title: 'title1',
          plural: 'plural1',
          metadata: {
            type: 'type1'
          }
        },
        {
          title: 'title2',
          plural: 'plural2',
          metadata: {
            type: 'type2'
          }
        },
        {
          title: 'title3',
          plural: 'plural3',
          metadata: {
            type: 'metaschema'
          }
        }
      ]
    };
    const wrapper = mount(
      <SidebarMenu schemaReducer={schemaReducer}/>
    );

    wrapper.update();
    wrapper.find('[type="text"]').simulate('change', {target: {value: 'title4'}});

    wrapper.find(MenuItem).should.have.length(0);
  });
});
