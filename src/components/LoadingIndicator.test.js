/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import {Spinner} from '@blueprintjs/core';
import LoadingIndicator from './LoadingIndicator';

chai.use(chaiEnzyme());
chai.should();

describe('< LoadingIndicator />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <LoadingIndicator/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain particular elements', () => {
    const wrapper = shallow(
      <LoadingIndicator/>
    );

    wrapper.find('div').should.have.length(1);
    wrapper.find(Spinner).should.have.length(1);
  });
});
