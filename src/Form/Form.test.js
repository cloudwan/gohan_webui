/* global it, describe */

import React from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import {ProgressBar} from '@blueprintjs/core';

import ConnectedForm, {Form} from './Form';

chai.use(chaiEnzyme());
chai.should();

const mockStore = configureStore();

describe('< Form />', () => {
  const baseSchema = {
    singular: 'singular',
    schema: {
      propertiesOrder: ['test1', 'test2'],
      properties: {
        test1: {
          type: 'string'
        },
        test2: {
          type: 'string'
        }
      }
    },
    parent: ''
  };

  it('should exist', () => {
    const store = mockStore({
      dialogReducer: {
        isLoading: false
      },
      uiSchemaReducer: {
        data: []
      },
      formReducer: {
        forms: {}
      }
    });

    const wrapper = shallow(
      <ConnectedForm store={store}
        baseSchema={{id: 'test'}}
        formName="test"
        onSubmit={() => {}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  describe('ProgressBar', () => {
    it('should show < ProgressBar /> when loading', () => {
      const wrapper = shallow(
        <Form formName="test"
          baseSchema={baseSchema}
          onSubmit={() => {}}
          isLoading={true}
        />
      );

      wrapper.find(ProgressBar).should.have.length(1);
    });

    it('should not show < ProgressBar /> when not loading', () => {
      const wrapper = shallow(
        <Form formName="test"
          baseSchema={baseSchema}
          onSubmit={() => {}}
          isLoading={false}
          schema={{}}
        />
      );

      wrapper.find(ProgressBar).should.have.length(0);
    });

    it('should show < ProgressBar /> when schema is not defined', () => {
      const wrapper = shallow(
        <Form formName="test"
          baseSchema={baseSchema}
          onSubmit={() => {}}
          isLoading={false}
          schema={{}}
        />
      );

      wrapper.find(ProgressBar).should.have.length(0);
    });
  });

  describe('Error', () => {
    it('should show an error', () => {
      const wrapper = shallow(
        <Form formName="test"
          baseSchema={baseSchema}
          onSubmit={() => {}}
          isLoading={false}
          schema={{}}
          error="An error"
        />
      );

      wrapper.contains(<div className="form-error">error: An error</div>).should.equal(true);
    });
  });

  describe('Properties length error', () => {
    it('should show an information about properties', () => {
      const wrapper = shallow(
        <Form formName="test"
          baseSchema={baseSchema}
          onSubmit={() => {}}
          isLoading={false}
          schema={{}}
        />
      );

      wrapper.contains(
        <span className="pt-empty-dialog-text">
          There are no properties that can be updated.
        </span>
      ).should.equal(true);
    });
  });

  describe('< JSONSchemaForm />', () => {
    it('should render a JSONSchemaForm', () => {
      const wrapper = shallow(
        <Form formName="test"
          baseSchema={baseSchema}
          onSubmit={() => {}}
          isLoading={false}
          schema={{
            properties: {
              foo: {}
            },
            propertiesOrder: ['foo'],
            required: []
          }}
          data={{}}
        />
      );

      wrapper.find('Form').should.have.length(1);
    });
  });

  describe('ActionButtons', () => {
    it('should render ActionButtons', () => {
      const wrapper = shallow(
        <Form formName="test"
          baseSchema={baseSchema}
          onSubmit={() => {}}
          isLoading={false}
          schema={{
            properties: {
              foo: {}
            },
            propertiesOrder: ['foo'],
            required: []
          }}
          data={{}}
          ActionButtons={(<button>button</button>)}
        />
      );

      wrapper.find('button').should.have.length(1);
    });

    it('should not render ActionButtons', () => {
      const wrapper = shallow(
        <Form formName="test"
          baseSchema={baseSchema}
          onSubmit={() => {}}
          isLoading={false}
          schema={{
            properties: {
              foo: {}
            },
            propertiesOrder: ['foo'],
            required: []
          }}
          data={{}}
        />
      );

      wrapper.find('button').should.have.length(0);
    });
  });
});
