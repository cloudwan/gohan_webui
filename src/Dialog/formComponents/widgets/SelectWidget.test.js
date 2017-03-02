/* global it, describe */

import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow, mount} from 'enzyme';

import SelectWidget from './SelectWidget';
import {Button, MenuItem} from '@blueprintjs/core';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< SelectWidget />', function () {
  it('should exist', () => {
    const enumOptions = [];
    const wrapper = shallow(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 div', () => {
    const enumOptions = [];
    const wrapper = shallow(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );

    wrapper.find('div').should.have.length(1);
  });

  it('should contain 1 button', () => {
    const enumOptions = [];
    const wrapper = shallow(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );

    wrapper.find(Button).should.have.length(1);
  });

  it('should render correctly list of options with non-null values', () => {
    const enumOptions = [
      {value: 'value1', label: 'label1'},
      {value: 'value2', label: 'label2'},
      {value: 'value3', label: 'label3'},
      {value: 'value4', label: 'label4'},
      {value: 'value5', label: 'label5'}
    ];
    const wrapper = shallow(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );
    wrapper.find(Button).simulate('click');

    wrapper.find(MenuItem).should.have.length(enumOptions.length);
  });

  it('should render correctly list of options with one null value', () => {
    const enumOptions = [
      {value: null},
      {value: 'value1', label: 'label1'},
      {value: 'value2', label: 'label2'},
      {value: 'value3', label: 'label3'},
      {value: 'value4', label: 'label4'},
      {value: 'value5', label: 'label5'}
    ];
    const wrapper = shallow(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );

    wrapper.find(Button).simulate('click');

    wrapper.find(MenuItem).should.have.length(enumOptions.length);
  });

  it('should check whether options are mapped correctly', () => {
    const enumOptions = [
      {value: null},
      {value: 'value1', label: 'label1'},
      {value: 'value2', label: 'label2'},
      {value: 'value3', label: 'label3'}
    ];
    const properHtml = '<ul class="pt-menu">' +
      '<!-- react-text: 7 -->' +
      '<!-- /react-text -->' +
      '<li class="">' +
      '<a class="pt-menu-item pt-popover-dismiss" tabindex="0">' +
      '<!-- react-text: 10 -->' +
      'Not selected' +
      '<!-- /react-text -->' +
      '</a>' +
      '</li>' +
      '<li class="">' +
      '<a class="pt-menu-item pt-popover-dismiss" tabindex="0">' +
      '<!-- react-text: 13 -->' +
      'label1' +
      '<!-- /react-text -->' +
      '</a>' +
      '</li>' +
      '<li class="">' +
      '<a class="pt-menu-item pt-popover-dismiss" tabindex="0">' +
      '<!-- react-text: 16 -->' +
      'label2' +
      '<!-- /react-text -->' +
      '</a>' +
      '</li>' +
      '<li class="">' +
      '<a class="pt-menu-item pt-popover-dismiss" tabindex="0">' +
      '<!-- react-text: 19 -->label3<!-- /react-text -->' +
      '</a>' +
      '</li>' +
      '</ul>';
    const wrapper = mount(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );
    wrapper.find(Button).simulate('click');

    wrapper.find('ul').should.have.html(properHtml);
  });

  it('should check option with default value', () => {
    const enumOptions = [
      {value: null},
      {value: 'value1', label: 'label1'},
      {value: 'value2', label: 'label2'},
      {value: 'value3', label: 'label3'}
    ];
    const wrapper = mount(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}} value={'value2'}
      />
    );

    wrapper.props().value.should.equal('value2');
  });
});
