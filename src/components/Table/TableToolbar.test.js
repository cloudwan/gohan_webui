/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import TableToolbar from './TableToolbar';

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.should();

describe('< TableToolbar />', () => {
  it('should exist', () => {
    const wrapper = shallow(<TableToolbar />);

    wrapper.should.not.be.equal(undefined);
  });

  it('should call creating resource onClick()', () => {
    const onNewResourceClick = sinon.spy();
    const props = {
      newResource: {
        visible: true,
        title: 'resource',
        onClick: onNewResourceClick
      }
    };
    const wrapper = mount(<TableToolbar {...props}/>);

    wrapper.find('.btn-primary').at(0).simulate('click');

    onNewResourceClick.should.callCount(1);
  });

  it('should call delete selected onClick()', () => {
    const onDeleteSelectedClick = sinon.spy();
    const props = {
      deleteSelected: {
        disabled: false,
        onClick: onDeleteSelectedClick
      }
    };
    const wrapper = mount(<TableToolbar {...props}/>);

    wrapper.find('.btn-danger').at(0).simulate('click');

    onDeleteSelectedClick.should.callCount(1);
  });
});
