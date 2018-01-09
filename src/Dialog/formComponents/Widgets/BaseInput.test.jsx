/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

import Input from './../../../components/Forms/Input';

import BaseInput from './BaseInput';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< BaseInput />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <BaseInput id={'0'} schema={{type: 'string'}}/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 < Input />', () => {
    const wrapper = shallow(
      <BaseInput id={'0'} schema={{type: 'string'}}/>
    );

    wrapper.find(Input).should.have.length(1);
  });

  it('should call onChange event', () => {
    const onChange = chai.spy();
    const wrapper = shallow(
      <BaseInput id={'0'} value={'test'}
        onChange={onChange} schema={{type: 'string'}}
      />
    );

    wrapper.find(Input).at(0).simulate('change', {target: {value: 'newValue'}});
    onChange.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });
});
