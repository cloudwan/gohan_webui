/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import Login from './Login';

chai.use(chaiEnzyme());
chai.should();

describe('< Login />', function () {
  it('should exist', () => {
    const wrapper = shallow(<Login onLoginSubmit={() => {}}/>);

    wrapper.should.not.equal(undefined);
  });

  it('should render 2 inputs', () => {
    const wrapper = shallow(<Login onLoginSubmit={() => {}}/>);

    wrapper.find('input').should.have.length(2);
  });

  it('should call submit after login button click', () => {
    const onLoginSubmit = chai.spy();
    const wrapper = mount(
      <Login onLoginSubmit={onLoginSubmit}/>
    );
    wrapper.find('input').at(0).node.value = 'login';
    wrapper.find('input').at(1).node.value = 'pass';
    wrapper.find('[type="submit"]').get(0).click();
  });

  it('should call submit with empty login and empty password', () => {
    const onLoginSubmit = (user, pass) => {
      user.should.equal('');
      pass.should.equal('');
    };
    const wrapper = mount(
      <Login onLoginSubmit={onLoginSubmit}/>
    );
    wrapper.find('form').simulate('submit', {preventDefault: () => {}, stopPropagation: () => {}});
  });

  it('should call submit with login and empty password', () => {
    const onLoginSubmit = (user, pass) => {
      user.should.equal('login');
      pass.should.equal('pass');
    };
    const wrapper = mount(
      <Login onLoginSubmit={onLoginSubmit}/>
    );
    wrapper.find('input').at(0).node.value = 'login';
    wrapper.find('input').at(1).node.value = 'pass';

    wrapper.find('form').simulate('submit', {preventDefault: () => {}, stopPropagation: () => {}});
  });
});

