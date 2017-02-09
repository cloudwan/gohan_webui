/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import NumberField from './NumberField';

chai.use(chaiEnzyme());
chai.should();


describe('< NumberField />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <NumberField schema={{}} onChange={() => {}}
        formContext={{}}
      />
    );

    wrapper.should.not.equal(undefined);
  });
});
