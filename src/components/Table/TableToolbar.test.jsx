/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow, mount} from 'enzyme';

import TableToolbar from './TableToolbar';
import {Button} from '@blueprintjs/core';

chai.use(spies);
chai.use(chaiEnzyme());
chai.should();

describe('< TableToolbar />', () => {
  it('should exist', () => {
    const wrapper = shallow(<TableToolbar />);

    wrapper.should.not.be.equal(undefined);
  });

  it('should call creating resource onClick()', () => {
    const onNewResourceClick = chai.spy();
    const props = {
      newResource: {
        title: 'resource',
        onClick: onNewResourceClick
      }
    };
    const wrapper = mount(<TableToolbar {...props}/>);

    wrapper.find(Button).should.have.length(2);
    wrapper.find(Button).at(0).simulate('click');

    onNewResourceClick.should.have.been.called.once; // eslint-disable-line
  });

  it('should call delete selected onClick()', () => {
    const onDeleteSelectedClick = chai.spy();
    const props = {
      deleteSelected: {
        disabled: false,
        onClick: onDeleteSelectedClick
      }
    };
    const wrapper = mount(<TableToolbar {...props}/>);

    wrapper.find(Button).should.have.length(2);
    wrapper.find(Button).at(1).simulate('click');

    onDeleteSelectedClick.should.have.been.called.once; // eslint-disable-line
  });
});
