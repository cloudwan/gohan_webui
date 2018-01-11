/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import BaseInput from './../Widgets/BaseInput';
import CheckboxWidget from './../Widgets/CheckboxWidget';
import BooleanField from './BooleanField';

chai.use(chaiEnzyme());
chai.should();

describe('< BooleanField />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <BooleanField schema={{}} onChange={() => {}}
        idSchema={{$id: '0'}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 CheckboxWidget on default', () => {
    const wrapper = shallow(
      <BooleanField schema={{}} onChange={() => {}}
        idSchema={{$id: '0'}}
      />
    );

    wrapper.find(CheckboxWidget).should.have.length(1);
  });


  it('should contain 1 BaseInput widget when passed ui:widget', () => {
    const uiSchema = {
      'ui:widget': BaseInput
    };
    const wrapper = mount(
      <BooleanField schema={{}} uiSchema={uiSchema}
        onChange={() => {}} onBlur={() => {}}
        formContext={{}}
      />
    );

    wrapper.find(BaseInput).should.have.length(1);
  });

});
