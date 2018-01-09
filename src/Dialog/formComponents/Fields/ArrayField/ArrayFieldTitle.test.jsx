/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import ArrayFieldTitle from './ArrayFieldTitle';

chai.use(chaiEnzyme());
chai.should();

describe('< ArrayFieldTitle />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <ArrayFieldTitle/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 empty div when no description is passed', () => {
    const wrapper = shallow(
      <ArrayFieldTitle/>
    );

    wrapper.find('div').should.have.length(1);
  });

});
