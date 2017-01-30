/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

import {Breadcrumb} from '@blueprintjs/core';
import BreadcrumbComponent from './Breadcrumb';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< BreadcrumbComponent />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <BreadcrumbComponent breadcrumbs={[]} />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 unordered list', () => {
    const wrapper = shallow(
      <BreadcrumbComponent breadcrumbs={[]} />
    );

    wrapper.find('ul').should.have.length(1);
    wrapper.find('li').should.have.length(1);
  });

  it('should contain 1 Breadcrumb when no breadcrumbs array passed', () => {
    const wrapper = shallow(
      <BreadcrumbComponent breadcrumbs={[]} />
    );

    wrapper.find(Breadcrumb).should.have.length(1);
  });

  it('should contain list of items when breadcrumbs array passed', () => {
    const breadcrumbs = [
      'item1', 'item2', 'item3'
    ];
    const wrapper = shallow(
      <BreadcrumbComponent breadcrumbs={breadcrumbs} />
    );

    wrapper.find(Breadcrumb).should.have.length(breadcrumbs.length + 1);
  });
});
