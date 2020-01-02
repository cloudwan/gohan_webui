/* global it, describe, document */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {mount} from 'enzyme';

import WebSocketTerminal from './WebSocketTerminal';

chai.use(chaiEnzyme());
chai.should();

describe('WebSocketTerminal', () => {
  describe('componentDidMount', () => {
    it('should set cookie', () => {
      mount(<WebSocketTerminal url={'https://localhost:6123'} authToken={'SampleAuthToken'}/>);

      document.cookie.should.equal('Auth-Token=SampleAuthToken');
    });
  });

  describe('componentWillUnmount', () => {
    it('should remove cookie', () => {
      const wrapper = mount(<WebSocketTerminal url={'https://localhost:6123'} authToken={'SampleAuthToken'}/>);
      wrapper.unmount();

      document.cookie.should.equal('');
    });
  });
});
