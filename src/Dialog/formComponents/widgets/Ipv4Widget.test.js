/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import Ipv4Widget from './Ipv4Widget';
import BaseInput from './BaseInput';

chai.use(chaiEnzyme());
chai.should();

describe('< Ipv4Widget />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <Ipv4Widget id={'0'} />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 BaseInput', () => {
    const wrapper = shallow(
      <Ipv4Widget id={'0'} />
    );

    wrapper.find(BaseInput).should.have.length(1);
  });
});
