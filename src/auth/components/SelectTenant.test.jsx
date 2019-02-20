/* global it, describe */
import React from 'react';
import chai from 'chai';
import sinon from 'sinon'; import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import SelectTenant from './SelectTenant';

chai.use(chaiEnzyme());
chai.use(sinonChai);
chai.should();

describe('< SelectTenant />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <SelectTenant onTenantSubmit={() => {}}
        tenantsByDomain={{
          fooDomain: {
            tenants: ['sample1', 'sample2'],
          }
        }}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should render 1 select', () => {
    const wrapper = shallow(
      <SelectTenant onTenantSubmit={() => {}}
        tenantsByDomain={{
          fooDomain: {
            tenants: ['sample1', 'sample2'],
          }
        }}
      />
    );

    wrapper.find('select').should.have.length(1);
  });

  it('should call handleTenantChange', () => {
    const wrapper = mount(
      <SelectTenant onTenantSubmit={() => {}}
        tenantsByDomain={{
          fooDomain: {
            tenants: [{name: 'sample1', id: 's1'}, {name: 'sample2', id: 's2'}],
          }
        }}
      />
    );

    wrapper.find('select').at(0).props().onChange({
      target: {value: 'sample2'}, preventDefault: () => {}, stopPropagation: () => {}
    });
    wrapper.state('id').should.be.equal('sample2');
  });

  it('should call handleSelectTenantSubmit', () => {
    const handleSelectTenantSubmit = sinon.spy();
    const wrapper = mount(
      <SelectTenant onTenantSubmit={handleSelectTenantSubmit}
        tenantsByDomain={{
          fooDomain: {
            tenants: [{name: 'sample1', id: 's1'}, {name: 'sample2', id: 's2'}],
          }
        }}
      />
    );

    wrapper.find('form').at(0).simulate('submit', {preventDefault: () => {}, stopPropagation: () => {}});
    handleSelectTenantSubmit.should.callCount(1); // eslint-disable-line no-unused-expressions
  });
});
