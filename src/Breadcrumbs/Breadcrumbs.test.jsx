/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';

import {Breadcrumb as BlueprintBreadcrumb} from '@blueprintjs/core';
import Breadcrumb from './Breadcrumbs';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('<Breadcrumb />', () => {
  const mockStore = configureMockStore();
  const createMockStore = elements => mockStore({
    breadcrumbReducer: {
      data: elements,
    }
  });

  it('should exist', () => {
    const store = createMockStore([]);
    const wrapper = mount(
      <Provider store={store}>
        <Breadcrumb />
      </Provider>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 empty unordered list when no elements are passed', () => {
    const store = createMockStore([]);
    const wrapper = mount(
      <Provider store={store}>
        <Breadcrumb />
      </Provider>
    );

    wrapper.find('ul').should.have.length(1);
    wrapper.find('li').should.have.length(0);
  });

  it('should contain list of items when breadcrumbs array passed', () => {
    const breadcrumbs = [
      {
        title: 'testItem1',
        url: '/testUrl1',
      },
      {
        title: 'testItem2',
        url: '/testUrl2',
      },
      {
        title: 'testItem3',
        url: '/testUrl3',
      },
    ];
    const store = createMockStore(breadcrumbs);
    const wrapper = mount(
      <Provider store={store}>
        <Breadcrumb />
      </Provider>
    );

    wrapper.find(BlueprintBreadcrumb).should.have.length(breadcrumbs.length);
  });
});
