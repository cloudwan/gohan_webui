/* global it, describe */

import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

import SelectWidget from './SelectWidget';
import Select from './../../../components/Forms/Select/Select';

chai.use(spies);
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
