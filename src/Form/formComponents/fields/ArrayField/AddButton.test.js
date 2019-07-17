/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import AddButton from './AddButton';

chai.use(chaiEnzyme());
chai.should();

describe('< AddButton />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <AddButton/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 div', () => {
    const wrapper = shallow(
      <AddButton/>
    );

    wrapper.find('div').should.have.length(1);
  });

  it('should contain 1 paragraph', () => {
    const wrapper = shallow(
      <AddButton/>
    );

    wrapper.find('p').should.have.length(1);
  });

  it('should contain 1 button', () => {
    const wrapper = shallow(
      <AddButton/>
    );

    wrapper.find('button').should.have.length(1);
  });
});
