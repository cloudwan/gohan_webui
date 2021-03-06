/* global it, describe */

import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import SelectWidget from './SelectWidget';
import Select from '../../../components/forms/Select/Select';

chai.use(chaiEnzyme());
chai.should();

describe('< SelectWidget />', function () {
  it('should exist', () => {
    const enumOptions = [];
    const wrapper = shallow(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 < Select />', () => {
    const enumOptions = [];
    const wrapper = shallow(
      <SelectWidget schema={{}} id={'0'}
        options={{enumOptions}}
      />
    );

    wrapper.find(Select).should.have.length(1);
  });
});
