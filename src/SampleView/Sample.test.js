/* global it, describe */
import React from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import ConnectedSample, {Sample} from './Sample';

chai.use(chaiEnzyme());
chai.should();

const mockStore = configureStore();

describe('< Sample />', () => {
  it('should exist', () => {
    const store = mockStore({
      configReducer: {
        app: 'foo',
        version: 'bar'
      }
    });
    const wrapper = shallow(
      <ConnectedSample store={store}/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain particular elements', () => {
    const wrapper = shallow(
      <Sample/>
    );

    wrapper.find('h1').should.have.length(1);
  });
});
