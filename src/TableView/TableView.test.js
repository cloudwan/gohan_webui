/* global it, describe */
import React from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import ConnectedTableView from './TableView';
import LoadingIndicator from '../components/LoadingIndicator';

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
        plural: 'test',
        schema: {
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
    const wrapper = shallow(
      <ConnectedTableView store={store} plural={'test'}/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain LoadingIndicator when component is loading', () => {
    const context = {};
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
          plural: 'test',
          schema: {
            properties: [],
            propertiesOrder: []
          }
        }]
      },
      tableReducer: {
        test: {
          data: [],
          isLoading: true,
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
    const wrapper = mount(
      <ConnectedTableView store={store} plural={'test'}/>,
      {context}
    );

    wrapper.find(LoadingIndicator).should.have.length(1);
  });
});
