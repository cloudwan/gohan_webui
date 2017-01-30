/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

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
    const wrapper = shallow(
      <SidebarMenu schemaReducer={schemaReducer}/>
    );

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
    const wrapper = shallow(
      <SidebarMenu schemaReducer={schemaReducer}/>
    );

    wrapper.find(MenuItem).should.have.length(2);
  });
});
