/* global it, describe */
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import LoadingIndicator from '../components/LoadingIndicator';
import Login from './components/Login';
import SelectTenant from './components/SelectTenant';
import {Toast} from '@blueprintjs/core';
import ConnectedAuth, {Auth} from './Auth';

chai.use(chaiEnzyme());
chai.should();
chai.use(sinonChai);

const mockStore = configureStore({});

describe('< Auth />', () => {
  const store = mockStore({
    authReducer: {
      tokenId: 0
    },
    configReducer: {
      storagePrefix: 'prefix'
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
        <Auth fetchTokenData={() => {}}
          inProgress={true}
          transferStorage={() => {}}
        />
      </Provider>
    );

    wrapper.find(LoadingIndicator).should.have.length(1);
  });

  it('should contain 1 Login', () => {
    const localStore = mockStore({});
    const wrapper = mount(
      <Provider store={localStore}>
        <Auth fetchTokenData={() => {}}
          transferStorage={() => {}}
        />
      </Provider>
    );

    wrapper.find(Login).should.have.length(1);
  });

  it('should contain 1 SelectTenant', () => {
    const localStore = mockStore({});
    const wrapper = mount(
      <Provider store={localStore}>
        <Auth fetchTokenData={() => {}}
          inProgress={true}
          tenants={['tenant1']}
          user={{username: 'test'}}
          transferStorage={() => {}}
        />
      </Provider>
    );

    wrapper.find(SelectTenant).should.have.length(1);
  });

  it('should contain 1 Toast with errorMessage', () => {
    const localStore = mockStore({});
    const wrapper = mount(
      <Provider store={localStore}>
        <Auth fetchTokenData={() => {}}
          errorMessage={'error'}
          transferStorage={() => {}}
        />
      </Provider>
    );

    wrapper.find(Toast).should.have.length(1);
  });

  it('should call onLoginSuccess from componentWillReceiveProps', () => {
    const onLoginSuccess = sinon.spy();
    const wrapper = mount(
      <Auth fetchTokenData={() => {}}
        onLoginSuccess={onLoginSuccess}
        transferStorage={() => {}}
      />
    );

    wrapper.setProps({
      tokenId: 'tokenId',
      tenant: 'tenant',
      tenants: [{name: 'sampleTenant', id: 'sampleTenantId'}],
      user: {name: 'sampleUser'},
    });

    onLoginSuccess.should.have.been.callCount(1);
  });

  it('should call resetErrorMessage and selectTenant from handleSelectTenantSubmit', () => {
    const resetErrorMessage = sinon.spy();
    const selectTenant = sinon.spy();
    const wrapper = mount(
      <Auth fetchTokenData={() => {}}
        resetErrorMessage={resetErrorMessage}
        selectTenant={selectTenant}
        transferStorage={() => {}}
        changeTenantFilter={() => {}}
      />
    );

    wrapper.node.handleSelectTenantSubmit({});
    resetErrorMessage.should.have.been.callCount(1);
    selectTenant.should.have.been.callCount(1);
  });

  it('should call resetErrorMessage and login from handleLoginSubmit', () => {
    const resetErrorMessage = sinon.spy();
    const login = sinon.spy();
    const wrapper = mount(
      <Auth fetchTokenData={() => {}}
        resetErrorMessage={resetErrorMessage}
        login={login}
        transferStorage={() => {}}
      />
    );

    wrapper.node.handleLoginSubmit({});
    resetErrorMessage.should.have.been.callCount(1);
    login.should.callCount(1);
  });
});
