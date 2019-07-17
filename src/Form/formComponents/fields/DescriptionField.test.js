/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import DescriptionField from './DescriptionField';

chai.use(chaiEnzyme());
chai.should();

describe('< DescriptionField />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <DescriptionField/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should show 1 div when no description prop passed', () => {
    const wrapper = shallow(
      <DescriptionField/>
    );

    wrapper.find('div').should.have.length(1);
  });

  it('should show 1 paragraph when string description passed', () => {
    const descriptionText = 'test';
    const wrapper = shallow(
      <DescriptionField description={descriptionText}/>
    );

    wrapper.find('p').should.have.length(1);
    wrapper.find('p').text().should.equal(descriptionText);
  });

  it('should show 1 div when non-string description passed', () => {
    const element = React.createElement('button');
    const wrapper = shallow(
      <DescriptionField description={element}/>
    );

    wrapper.find('div').should.have.length(1);
    wrapper.find('button').should.have.length(1);
  });
});
