/* global it, describe */
import React from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import {Button} from '@blueprintjs/core';
import ConnectedDialog, {GeneratedDialog} from './Dialog';

chai.use(chaiEnzyme());
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

  it('should exist', () => {
    const store = mockStore({
      dialogReducer: {
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
      <GeneratedDialog action={action}
        baseSchema={baseSchema}
        data={data}
        isLoading={false}
        onClose={() => {}}
        isOpen={true}
      />
    );

    wrapper.find(Button).should.have.length(2);
  });
});
