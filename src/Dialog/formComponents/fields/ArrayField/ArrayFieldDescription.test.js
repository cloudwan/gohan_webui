/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import ArrayFieldDescription from './ArrayFieldDescription';

chai.use(chaiEnzyme());
chai.should();

describe('< ArrayFieldDescription />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <ArrayFieldDescription/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 empty div when no description is passed', () => {
    const wrapper = shallow(
      <ArrayFieldDescription/>
    );

    wrapper.find('div').should.have.length(1);
  });

});
