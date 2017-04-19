/* global it, describe */
import React from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow, render} from 'enzyme';

import ConnectedTableView from './TableView';

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
    const context = {};
    const wrapper = render(
      <ConnectedTableView store={store}/>,
      {context}
    );

    wrapper.find('div').should.have.length(3);
  });

  it('should contain LoadingIndicator when component is loading', () => {
    const context = {};
    const wrapper = render(
      <ConnectedTableView store={store}/>,
      {context}
    );

    wrapper.find('.loading-container').should.have.length(1);
  });
});
