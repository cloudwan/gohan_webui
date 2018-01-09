/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import BaseInput from '../Widgets/BaseInput';
import TextWidget from '../Widgets/TextWidget';
import SelectWidget from '../Widgets/SelectWidget';
import StringField from './StringField';

chai.use(chaiEnzyme());
chai.should();

describe('< StringField />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <StringField schema={{}} uiSchema={{}}
        onChange={() => {}} onBlur={() => {}}
        formContext={{}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 TextWidget on default', () => {
    const wrapper = shallow(
      <StringField schema={{}} uiSchema={{}}
        onChange={() => {}} onBlur={() => {}}
        formContext={{}}
      />
    );

    wrapper.find(TextWidget).should.have.length(1);
  });

  it('should contain 1 SelectWidget when passed options in schema', () => {
    const schema = {
      options: ['test1', 'test2']
    };
    const wrapper = shallow(
      <StringField schema={schema} uiSchema={{}}
        onChange={() => {}} onBlur={() => {}}
        formContext={{}}
      />
    );

    wrapper.find(SelectWidget).should.have.length(1);
  });

  it('should contain 1 SelectWidget when passed enum in schema', () => {
    const schema = {
      enum: ['test1', 'test2']
    };
    const wrapper = shallow(
      <StringField schema={schema} uiSchema={{}}
        onChange={() => {}}
        onBlur={() => {}}
        formContext={{}}
      />
    );

    wrapper.find(SelectWidget).should.have.length(1);
  });

  it('should contain 1 TextWidget when passed ui:widget', () => {
    const schema = {
      title: 'test',
      type: 'string',
      description: 'test'
    };
    const uiSchema = {
      'ui:widget': TextWidget
    };
    const wrapper = mount(
      <StringField schema={schema} uiSchema={uiSchema}
        onChange={() => {}} onBlur={() => {}}
        formContext={{}}
      />
    );

    wrapper.find(TextWidget).should.have.length(1);
  });

  it('should contain 1 BaseInput widget when passed ui:widget and options', () => {
    const schema = {
      title: 'test',
      type: 'string',
      description: 'test',
      options: ['test1', 'test2']
    };
    const uiSchema = {
      'ui:widget': BaseInput
    };
    const wrapper = mount(
      <StringField schema={schema} uiSchema={uiSchema}
        onChange={() => {}} onBlur={() => {}}
        formContext={{}}
      />
    );

    wrapper.find(BaseInput).should.have.length(1);
  });

  it('should contain 1 BaseInput widget when passed ui:widget and enum', () => {
    const schema = {
      title: 'test',
      type: 'string',
      description: 'test',
      enum: ['test1', 'test2']
    };
    const uiSchema = {
      'ui:widget': BaseInput
    };
    const wrapper = mount(
      <StringField schema={schema} uiSchema={uiSchema}
        onChange={() => {}} onBlur={() => {}}
        formContext={{}}
      />
    );

    wrapper.find(BaseInput).should.have.length(1);
  });

  it('should contain 1 BaseInput widget when passed ui:widget', () => {
    const schema = {
      title: 'test',
      type: 'string',
      description: 'test'
    };
    const uiSchema = {
      'ui:widget': BaseInput
    };
    const wrapper = mount(
      <StringField schema={schema} uiSchema={uiSchema}
        onChange={() => {}} onBlur={() => {}}
        formContext={{}}
      />
    );

    wrapper.find(BaseInput).should.have.length(1);
  });
});
