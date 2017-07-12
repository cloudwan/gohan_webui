/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow, mount} from 'enzyme';

import {Sidebar} from './Sidebar';

import Search from './components/Search';
import Menu from './components/Menu';
import MenuItem from './components/MenuItem';
import Container from './components/Container';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();


describe('< Sidebar />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain one < Container />', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.find(Container).should.have.length(1);
  });

  it('should contain one < Search />', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.find(Search).should.have.length(1);
  });

  it('should contain one < Menu />', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.find(Menu).should.have.length(1);
  });


  it('should contain list of 2 MenuItems', () => {
    const menuItems = [
      {
        title: 'title1',
        path: '#/plural1',
      },
      {
        title: 'title2',
        path: '#/plural2',
      }
    ];
    const wrapper = mount(
      <Sidebar menuItems={menuItems}/>
    );

    wrapper.find(MenuItem).should.have.length(2);
    wrapper.find(MenuItem).at(0).props().text.should.equal('title1');
    wrapper.find(MenuItem).at(0).props().href.should.equal('#/plural1');
    wrapper.find(MenuItem).at(0).props().isActive.should.equal(false);

    wrapper.find(MenuItem).at(1).props().text.should.equal('title2');
    wrapper.find(MenuItem).at(1).props().href.should.equal('#/plural2');
    wrapper.find(MenuItem).at(1).props().isActive.should.equal(false);
  });

  it('should have initial state', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.state('searchQuery').should.be.equal('');
  });

  it('should call handle onChange function', () => {
    const wrapper = shallow(
      <Sidebar/>
    );


    wrapper.find(Search).props().onChange({target: {value: 'test'}});
    wrapper.state().searchQuery.should.equal('test');
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
      <Sidebar pathname={'/plural1'} menuItems={menuItems}/>
    );

    wrapper.find(MenuItem).findWhere(item => item.props().isActive === true).should.have.length(1);
  });
});
