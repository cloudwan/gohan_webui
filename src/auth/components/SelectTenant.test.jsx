/* global it, describe */
import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import SelectTenant from './SelectTenant';

chai.use(chaiEnzyme());
chai.use(spies);
chai.should();

describe('< SelectTenant />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <SelectTenant tenants={['sample1', 'sample2']} onTenantSubmit={() => {}}/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should render 1 select', () => {
    const wrapper = shallow(
      <SelectTenant tenants={['sample1', 'sample2']} onTenantSubmit={() => {}}/>
    );

    wrapper.find('select').should.have.length(1);
  });

  it('should call handleTenantChange', () => {
    const wrapper = mount(
      <SelectTenant tenants={[{name: 'sample1', id: 's1'}, {name: 'sample2', id: 's2'}]} onTenantSubmit={() => {}}/>
    );

    wrapper.find('select').at(0).props().onChange({
      target: {value: 'sample2'}, preventDefault: () => {}, stopPropagation: () => {}
    });
    wrapper.state('value').should.be.equal('sample2');
  });

  it('should call handleSelectTenantSubmit', () => {
    const handleSelectTenantSubmit = chai.spy();
    const wrapper = mount(
      <SelectTenant tenants={[{name: 'sample1', id: 's1'}, {name: 'sample2', id: 's2'}]}
        onTenantSubmit={handleSelectTenantSubmit}
      />
    );

    wrapper.find('form').at(0).simulate('submit', {preventDefault: () => {}, stopPropagation: () => {}});
    handleSelectTenantSubmit.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });
});
