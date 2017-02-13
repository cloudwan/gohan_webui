/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import Label from './Label';

chai.use(chaiEnzyme());
chai.should();

describe('< Label />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <Label/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 div when no label passed', () => {
    const wrapper = shallow(
      <Label/>
    );

    wrapper.find('div').should.have.length(1);
  });

  it('should contain 1 legend', () => {
    const wrapper = shallow(
      <Label label="label1"/>
    );

    wrapper.find('legend').should.have.length(1);
  });

  it('should contain 1 span when required prop passed', () => {
    const wrapper = shallow(
      <Label label="label1" required={true}/>
    );

    wrapper.find('span').should.have.length(1);
  });
});
