/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import UserMenu from './UserMenu';

chai.use(chaiEnzyme());
chai.should();

describe('< UserMenu />', function () {
  it('should exist', () => {
    const wrapper = shallow(<UserMenu open={true} onRequestChange={() => {}}/>);

    wrapper.should.not.equal(undefined);
  });
});

