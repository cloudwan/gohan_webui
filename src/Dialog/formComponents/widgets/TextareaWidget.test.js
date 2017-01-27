/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

import TextareaWidget from './TextareaWidget';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< TextareaWidget />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <TextareaWidget schema={{}} id={'0'} />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 textarea', () => {
    const wrapper = shallow(
      <TextareaWidget schema={{}} id={'0'} />
    );

    wrapper.find('textarea').should.have.length(1);
  });

  it('should have empty value when value prop not passed', () => {
    const wrapper = shallow(
      <TextareaWidget schema={{}} id={'0'} />
    );

    wrapper.find('textarea').get(0).props.value.should.equal('');
  });

  it('should have the same value as passed by prop', () => {
    const wrapper = shallow(
      <TextareaWidget schema={{}} id={'0'}
        value={'test'}
      />
    );

    wrapper.find('textarea').get(0).props.value.should.equal('test');
  });
});
