/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';
import {Button} from '@blueprintjs/core';

import SelectTenant from './SelectTenant';

chai.use(chaiEnzyme());
chai.should();

describe('< SelectTenant />', function () {
  it('should exist', () => {
    const wrapper = shallow(<SelectTenant tenants={['sample1', 'sample2']} onTenantSubmit={() => {}}/>);

    wrapper.should.not.equal(undefined);
  });

  it('should render 1 select', () => {
    const wrapper = shallow(<SelectTenant tenants={['sample1', 'sample2']} onTenantSubmit={() => {}}/>);

    wrapper.find('select').should.have.length(1);
  });

  it('should render 1 button', () => {
    const wrapper = shallow(<SelectTenant tenants={['sample1', 'sample2']} onTenantSubmit={() => {}}/>);
    wrapper.find(Button).should.have.length(1);
  });
});

