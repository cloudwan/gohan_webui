/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import {NotFound} from './NotFound';

chai.use(chaiEnzyme());
chai.should();

describe('< NotFound />', function () {
  it('should exist', () => {
    const wrapper = shallow(<NotFound/>);

    wrapper.should.not.equal(undefined);
  });
});
