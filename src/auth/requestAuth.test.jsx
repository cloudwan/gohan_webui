/* global it, describe, beforeEach */
import React, {Component} from 'react';
import configureStore from 'redux-mock-store';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import requestAuth from './requestAuth';

chai.use(chaiEnzyme());
chai.should();

const mockStore = configureStore();

describe('reguestAuth', function () {
  let MockComponent;

  beforeEach(() => {
    MockComponent = class extends Component {
      render() {
        return (
          <div>Test component</div>
        );
      }
    };
  });

  it('should exist', () => {
    const RequestAuthComponent = requestAuth(MockComponent);
    const wrapper = shallow(<RequestAuthComponent store={mockStore({authReducer: {}})}/>);

    wrapper.should.not.equal(undefined);
  });
});
