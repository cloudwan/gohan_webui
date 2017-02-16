/* global it, describe */
import React from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import {Dialog, Button, ProgressBar} from '@blueprintjs/core';
import Form from 'react-jsonschema-form';
import ConnectedDialog, {GeneratedDialog} from './Dialog';

chai.use(chaiEnzyme());
chai.use(spies);
chai.should();

const mockStore = configureStore();

describe('< Dialog />', () => {
  const action = ['title'];
  const schema = {
    singular: 'singular',
  };
  const data = {
    test1: 'test1',
    test2: 'test2',
    id: 0
  };

  it('should exist', () => {
    const store = mockStore({});
    const wrapper = shallow(
      <ConnectedDialog store={store} />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain particular elements', () => {
    const dialogReducer = {
      isLoading: false,
      schema: {
        propertiesOrder: ['test1', 'test2']
      }
    };
    const wrapper = shallow(
      <GeneratedDialog action={action} schema={schema}
        dialogReducer={dialogReducer} data={data}
      />
    );

    wrapper.find(Dialog).should.have.length(1);
    wrapper.find(Form).should.have.length(1);
    wrapper.find('div').should.have.length(5);
    wrapper.find(Button).should.have.length(2);
  });

  it('should contain ProgressBar when loading', () => {
    const dialogReducer = {
      isLoading: true,
      schema: {
        propertiesOrder: ['test1', 'test2']
      }
    };
    const wrapper = shallow(
      <GeneratedDialog action={action} schema={schema}
        dialogReducer={dialogReducer} data={data}
      />
    );

    wrapper.find(ProgressBar).should.have.length(1);
  });

  it('should call clearData on unmounting', () => {
    const clearData = chai.spy();
    const dialogReducer = {
      isLoading: false,
      schema: {
        propertiesOrder: ['test1', 'test2']
      }
    };
    const wrapper = mount(
      <GeneratedDialog action={action} schema={schema}
        dialogReducer={dialogReducer} data={data}
        fetchRelationFields={() => {}} clearData={clearData}
      />
    );

    wrapper.unmount();
    clearData.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });
});
