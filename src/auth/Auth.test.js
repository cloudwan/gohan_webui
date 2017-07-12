/* global it, describe */
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import LoadingIndicator from '../components/LoadingIndicator';
import Login from './components/Login';
import SelectTenant from './components/SelectTenant';
import {Toast} from '@blueprintjs/core';
import ConnectedAuth, {Auth} from './Auth';

chai.use(chaiEnzyme());
chai.use(spies);
chai.should();

const mockStore = configureStore({});

describe('< Auth />', () => {
  const store = mockStore({
    authReducer: {
      tokenId: 0
    }
  });

  it('should exist', () => {
    const wrapper = shallow(
      <ConnectedAuth store={store} />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 LoadingIndicator when loading', () => {
    const localStore = mockStore({});
    const wrapper = mount(
      <Provider store={localStore}>
        <Auth fetchTokenData={() => {}} inProgress={true} />
      </Provider>
    );

    wrapper.find(LoadingIndicator).should.have.length(1);
  });

  it('should contain 1 Login', () => {
    const localStore = mockStore({});
    const wrapper = mount(
      <Provider store={localStore}>
        <Auth fetchTokenData={() => {}} />
      </Provider>
    );

    wrapper.find(Login).should.have.length(1);
  });

  it('should contain 1 SelectTenant', () => {
    const localStore = mockStore({});
    const wrapper = mount(
      <Provider store={localStore}>
        <Auth fetchTokenData={() => {}} inProgress={true}
          tenants={['tenant1']} user={{username: 'test'}}
        />
      </Provider>
    );

    wrapper.find(SelectTenant).should.have.length(1);
  });

  it('should contain 1 Toast with errorMessage', () => {
    const localStore = mockStore({});
    const wrapper = mount(
      <Provider store={localStore}>
        <Auth fetchTokenData={() => {}} errorMessage={'error'}/>
      </Provider>
    );

    wrapper.find(Toast).should.have.length(1);
  });

  it('should call onLoginSuccess from componentWillReceiveProps', () => {
    const onLoginSuccess = chai.spy();
    const wrapper = mount(
      <Auth fetchTokenData={() => {}} onLoginSuccess={onLoginSuccess} />
    );

    wrapper.setProps({
      tokenId: 1,
      tenant: 'tenant',
      tenants: []
    });

    onLoginSuccess.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });

  it('should call resetErrorMessage and selectTenant from handleSelectTenantSubmit', () => {
    const resetErrorMessage = chai.spy();
    const selectTenant = chai.spy();
    const wrapper = mount(
      <Auth fetchTokenData={() => {}} resetErrorMessage={resetErrorMessage}
        selectTenant={selectTenant}
      />
    );

    wrapper.node.handleSelectTenantSubmit({});

    resetErrorMessage.should.have.been.called.once; // eslint-disable-line no-unused-expressions
    selectTenant.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });

  it('should call resetErrorMessage and login from handleLoginSubmit', () => {
    const resetErrorMessage = chai.spy();
    const login = chai.spy();
    const wrapper = mount(
      <Auth fetchTokenData={() => {}} resetErrorMessage={resetErrorMessage}
        login={login}
      />
    );

    wrapper.node.handleLoginSubmit({});

    resetErrorMessage.should.have.been.called.once; // eslint-disable-line no-unused-expressions
    login.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });
});
