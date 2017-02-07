/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow} from 'enzyme';

import CodeWidget from './CodeWidget';
import CodeMirror from 'react-codemirror';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

const mockedProps = {readonly: false, schema: {format: 'yaml'}};
describe('< CodeWidget />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <CodeWidget {...mockedProps}/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 CodeMirror component', () => {
    const wrapper = shallow(
      <CodeWidget {...mockedProps}/>
    );

    wrapper.find(CodeMirror).should.have.length(1);
  });
});
