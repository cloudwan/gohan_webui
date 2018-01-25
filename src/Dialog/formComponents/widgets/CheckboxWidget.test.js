/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon'; import sinonChai from 'sinon-chai';
import {shallow} from 'enzyme';

import CheckboxWidget from './CheckboxWidget';

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.should();

describe('< CheckboxWidget />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <CheckboxWidget schema={{}} id={'0'} />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 label', () => {
    const wrapper = shallow(
      <CheckboxWidget schema={{}} id={'0'} />
    );

    wrapper.find('label').should.have.length(1);
  });

  it('should contain 1 input', () => {
    const wrapper = shallow(
      <CheckboxWidget schema={{}} id={'0'} />
    );

    wrapper.find('input').should.have.length(1);
  });

  it('should have unchecked input when "checked" value is undefined', () => {
    const wrapper = shallow(
      <CheckboxWidget schema={{}} id={'0'} />
    );

    wrapper.find('[type="checkbox"]').get(0).props.checked.should.equal(false);
  });

  it('should have checked input when "checked" value is true', () => {
    const wrapper = shallow(
      <CheckboxWidget schema={{}} id={'0'}
        value={true}
      />
    );

    wrapper.find('[type="checkbox"]').get(0).props.checked.should.equal(true);
  });

  it('should have unchecked input when "checked" value is not undefined and is false', () => {
    const wrapper = shallow(
      <CheckboxWidget schema={{}} id={'0'}
        value={false}
      />
    );

    wrapper.find('[type="checkbox"]').get(0).props.checked.should.equal(false);
  });

  it('should call onChange event', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <CheckboxWidget schema={{}} id={'0'}
        value={false} onChange={onChange}
      />
    );

    wrapper.find('input').at(0).simulate('change', {target: {checked: true}});
    onChange.should.have.been.callCount(1); // eslint-disable-line no-unused-expressions
  });

});
