/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import TitleField from './TitleField';

chai.use(chaiEnzyme());
chai.should();

describe('< TitleField />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <TitleField/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 legend element', () => {
    const wrapper = shallow(
      <TitleField/>
    );

    wrapper.find('legend').should.have.length(1);
  });

  it('should have title inside legend', () => {
    const testTitle = 'test title';
    const wrapper = shallow(
      <TitleField title={testTitle}/>
    );

    wrapper.find('legend').text().should.be.equal(testTitle);
  });

  it('should have span when "required" value is true', () => {
    const wrapper = shallow(
      <TitleField required={true}/>
    );

    wrapper.find('span').should.have.length(1);
  });
});
