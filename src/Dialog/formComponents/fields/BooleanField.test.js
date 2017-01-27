/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

import BooleanField from './BooleanField';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< BooleanField />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <BooleanField schema={{}} onChange={() => {}}
        idSchema={{$id: '0'}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

});
