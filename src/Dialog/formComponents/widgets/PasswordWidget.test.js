/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

import PasswordWidget from './PasswordWidget';
import BaseInput from './BaseInput';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< PasswordWidget />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <PasswordWidget id={'0'} />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 BaseInput', () => {
    const wrapper = shallow(
      <PasswordWidget id={'0'} />
    );

    wrapper.find(BaseInput).should.have.length(1);
  });
});
