/* global it, describe */
import React from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import {getTableView} from './TableView';

chai.use(chaiEnzyme());
chai.use(spies);
chai.should();

const mockStore = configureStore();

describe('< TableView />', () => {
  const store = mockStore({
    activeSchema: [],
    headers: null,
    pageCount: null,
    activePage: null,
    configReducer: {
      pageLimit: 5
    },
    schemaReducer: {
      data: [{
        id: 'test',
        plural: 'test',
        schema: {
          permission: [],
          properties: [],
          propertiesOrder: []
        }
      }]
    },
    tableReducer: {
      test: {
        data: [],
        isLoading: false,
        limit: 0,
        offset: 0,
        plural: 'test',
        totalCount: 0
      }
    },
    dialogReducer: {
      isLoading: false
    }
  });

  it('should exist', () => {
    const ConnectedTableView = getTableView({id: 'test', plural: 'tests',title: 'Test'}, undefined, true);

    const wrapper = shallow(
      <ConnectedTableView store={store}
        match={{params: {}}}
      />
    );

    wrapper.should.not.equal(undefined);
  });
});
