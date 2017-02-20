/* global it, describe */
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import Table from '../components/Table';
import LoadingIndicator from '../components/LoadingIndicator';
import {Alert} from '@blueprintjs/core';
import ConnectedTableView, {TableView} from './TableView';

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
      data: []
    },
    tableReducer: {
      data: [],
      deletedMultipleResources: false,
      isLoading: false,
      limit: 0,
      offset: 0,
      plural: 'test',
      totalCount: 0
    },
    dialogReducer: {
      isLoading: false
    }
  });
  it('should exist', () => {
    const wrapper = shallow(
      <ConnectedTableView store={store} />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain particular elements', () => {
    const wrapper = shallow(
      <TableView schemaReducer={{}} fetchData={() => {}}
        clearData={() => {}} tableReducer={{isLoading: false}}
        schema={{}} data={[]}
        visibleColumns={[]}
      />
    );

    wrapper.find('div').should.have.length(1);
    wrapper.find(Table).should.have.length(1);
  });

  it('should contain LoadingIndicator when component is loading', () => {
    const wrapper = shallow(
      <TableView schemaReducer={{}} fetchData={() => {}}
        clearData={() => {}} tableReducer={{isLoading: true}}
      />
    );

    wrapper.find(LoadingIndicator).should.have.length(1);
  });

  it('should contain LoadingIndicator when no tableReducer is passed', () => {
    const wrapper = shallow(
      <TableView schemaReducer={{}} fetchData={() => {}}
        clearData={() => {}}
      />
    );

    wrapper.find(LoadingIndicator).should.have.length(1);
  });

  it('should show Alert component', () => {
    const tableReducer = {
      deletedMultipleResources: false,
      data: [],
      filters: {
        filterBy: '',
        filterValue: ''
      }
    };
    const headers = [
      'test'
    ];
    const schema = {
      schema: {
        properties: {
          test: {
            title: 'test'
          }
        }
      },
      singular: 'test'
    };
    const wrapper = mount(
      <Provider store={store}>
        <TableView schemaReducer={{}} fetchData={() => {}}
          clearData={() => {}} tableReducer={tableReducer}
          activeSchema={schema} headers={headers}
        />
      </Provider>
    );

    wrapper.find(TableView).at(0).node.handleOpenAlert({});
    wrapper.update();
    wrapper.find(Alert).should.have.length(1);
  });

});
