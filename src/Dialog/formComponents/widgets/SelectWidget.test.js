/* global it, describe */

import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow, mount} from 'enzyme';

import SelectWidget from './SelectWidget';

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

  it('should contain 1 select', () => {
    const enumOptions = [];
    const wrapper = shallow(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );

    wrapper.find('select').should.have.length(1);
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

    wrapper.find('option').should.have.length(enumOptions.length);
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

    wrapper.find('option').should.have.length(enumOptions.length);
  });

  it('should check whether options are mapped correctly', () => {
    const enumOptions = [
      {value: null},
      {value: 'value1', label: 'label1'},
      {value: 'value2', label: 'label2'},
      {value: 'value3', label: 'label3'}
    ];
    const properHtml = '<select>' +
      '<option value="">Choose an item...</option>' +
      '<option value="value1">label1</option>' +
      '<option value="value2">label2</option>' +
      '<option value="value3">label3</option>' +
      '</select>';
    const wrapper = mount(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );

    wrapper.find('select').should.have.html(properHtml);
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

    wrapper.find('select').get(0).value.should.equal('value2');
  });
});
