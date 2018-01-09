/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import Label from './Label';

import LabelComponent from './../../components/Forms/Label';

chai.use(chaiEnzyme());
chai.should();

describe('< Label />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <Label/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 < LabelComponent />', () => {
    const wrapper = shallow(
      <Label label="label1"/>
    );

    wrapper.find(LabelComponent).should.have.length(1);
  });
});
