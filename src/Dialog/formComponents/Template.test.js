/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import Label from './Label';
import Template from './Template';

chai.use(chaiEnzyme());
chai.should();

describe('< Template />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <Template>
        <div/>
      </Template>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 div', () => {
    const wrapper = shallow(
      <Template>
        <span />
      </Template>
    );

    wrapper.find('div').should.have.length(1);
  });

  it('should contain 1 Label', () => {
    const wrapper = shallow(
      <Template>
        <span />
      </Template>
    );

    wrapper.find(Label).should.have.length(1);
  });

  it('should contain only children', () => {
    const wrapper = shallow(
      <Template hidden={true}>
        <span />
      </Template>
    );

    wrapper.find('span').should.have.length(1);
    wrapper.find('div').should.have.length(0);
    wrapper.find(Label).should.have.length(0);
  });

  it('should not contain Label', () => {
    const wrapper = shallow(
      <Template displayLabel={false}>
        <div />
      </Template>
    );

    wrapper.find(Label).should.have.length(0);
  });

  it('should contain description element', () => {
    const description = <span>Description</span>;
    const wrapper = shallow(
      <Template description={description}>
        <div />
      </Template>
    );

    wrapper.find('span').should.have.length(1);
    wrapper.find('span').text().should.equal('Description');
  });

  it('should not contain description when displayLabel is not passed', () => {
    const description = <span>Description</span>;
    const wrapper = shallow(
      <Template displayLabel={false} description={description}>
        <div/>
      </Template>
    );

    wrapper.find('span').should.have.length(0);
  });
});
