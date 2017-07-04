/* global it, describe */
import React from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import {Button, ProgressBar} from '@blueprintjs/core';
import ConnectedDialog, {GeneratedDialog} from './Dialog';

chai.use(chaiEnzyme());
chai.use(spies);
chai.should();

const mockStore = configureStore();

describe('< Dialog />', () => {
  const action = 'create';
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
  const data = {
    test1: 'test1',
    test2: 'test2',
    id: 0
  };
  const schema = {
    propertiesOrder: ['test1', 'test2'],
    properties: {
      test1: {
        type: 'string'
      },
      test2: {
        type: 'string'
      }
    }
  };

  it('should exist', () => {
    const store = mockStore({
      dialogReducer: {
        schema: {
          id: '1',
          propertiesOrder: ['test1', 'test2']
        },
        isLoading: false
      },
      uiSchemaReducer: {
        data: []
      }
    });
    const wrapper = shallow(
      <ConnectedDialog store={store} baseSchema={{id: 'test'}}/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 2 Buttons when passed onClose function', () => {
    const wrapper = shallow(
      <GeneratedDialog action={action} baseSchema={baseSchema}
        schema={schema} data={data}
        prepareSchema={() => {}} isLoading={false}
        onClose={() => {}} clearData={() => {}}
        isOpen={true}
      />
    );

    wrapper.find(Button).should.have.length(2);
  });

  it('should contain ProgressBar when loading', () => {
    const wrapper = shallow(
      <GeneratedDialog action={action} baseSchema={baseSchema}
        schema={schema} data={data}
        prepareSchema={() => {}} isLoading={true}
        clearData={() => {}} isOpen={true}
      />
    );

    wrapper.find(ProgressBar).should.have.length(1);
  });
});
