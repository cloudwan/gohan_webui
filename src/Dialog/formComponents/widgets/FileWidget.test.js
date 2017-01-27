/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow, mount} from 'enzyme';

import FileWidget from './FileWidget';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< FileWidget />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <FileWidget/>
    );

    wrapper.should.not.be.equal(undefined);
  });

  it('should contain 1 div', () => {
    const wrapper = mount(
      <FileWidget multiple={false} id={'0'}
        readonly={false} disabled={false}
        autofocus={false}
      />
    );

    wrapper.find('div').should.have.length(1);
  });

  it('should contain 1 paragraph', () => {
    const wrapper = shallow(
      <FileWidget/>
    );

    wrapper.find('p').should.have.length(1);
  });

  it('should contain 1 input', () => {
    const wrapper = shallow(
      <FileWidget/>
    );

    wrapper.find('input').should.have.length(1);
  });

  it('should contain 1 FilesInfo', () => {
    const wrapper = mount(
      <FileWidget/>
    );

    wrapper.find('FilesInfo').should.have.length(1);
  });

  it('should have initial state with empty values', () => {
    const wrapper = shallow(
      <FileWidget multiple={false} id={'0'}
        readonly={false} disabled={false}
        autofocus={false} value={[]}
      />
    );

    wrapper.state('values').should.deep.equal([]);
  });

  it('should have initial state with empty filesInfo', () => {
    const wrapper = shallow(
      <FileWidget multiple={false} id={'0'}
        readonly={false} disabled={false}
        autofocus={false} value={[]}
      />
    );

    wrapper.state('filesInfo').should.deep.equal([]);
  });
});
