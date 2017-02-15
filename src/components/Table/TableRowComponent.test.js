/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import {Link} from 'react-router';
import {Tooltip, Popover} from '@blueprintjs/core';
import TableRowComponent from './TableRowComponent';

chai.use(chaiEnzyme());
chai.should();

describe('< TableRowComponent />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <TableRowComponent schema={{}} visibleColumns={[]}
        rowItem={{}} onRemoveClick={() => {}}
        onEditClick={() => {}} onCheckboxChange={() => {}}
        checkedAll={{}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain particular elements', () => {
    const wrapper = shallow(
      <TableRowComponent schema={{}} visibleColumns={[]}
        rowItem={{}} onRemoveClick={() => {}}
        onEditClick={() => {}} onCheckboxChange={() => {}}
        checkedAll={{}}
      />
    );

    wrapper.find('tr').should.have.length(1);
    wrapper.find('td').should.have.length(2);
    wrapper.find(Tooltip).should.have.length(2);
    wrapper.find('span').should.have.length(2);
    wrapper.find('input').should.have.length(1);
  });

  it('should contain 2 table cells with rowItem data', () => {
    const title = 'rowItem title';
    const description = 'rowItem description';
    const visibleColumns = ['title', 'description'];
    const rowItem = {
      title,
      description
    };
    const wrapper = shallow(
      <TableRowComponent schema={{}} visibleColumns={visibleColumns}
        rowItem={rowItem} onRemoveClick={() => {}}
        onEditClick={() => {}} onCheckboxChange={() => {}}
        checkedAll={{}}
      />
    );

    wrapper.find('td').filterWhere(item => {
      const itemContent = item.node.props.children;
      return itemContent === title || itemContent === description;
    }).should.have.length(2);
  });

  it('should contain 1 table cell with null', () => {
    const visibleColumns = ['nullable'];
    const rowItem = {
      nullable: null
    };
    const wrapper = shallow(
      <TableRowComponent schema={{}} visibleColumns={visibleColumns}
        rowItem={rowItem} onRemoveClick={() => {}}
        onEditClick={() => {}} onCheckboxChange={() => {}}
        checkedAll={{}}
      />
    );

    wrapper.find('td').filterWhere(item => {
      const itemContent = item.node.props.children;
      return itemContent === 'null';
    }).should.have.length(1);
  });

  it('should contain 1 table cell with Popover', () => {
    const visibleColumns = ['popoverData'];
    const rowItem = {
      popoverData: {
        data: 'test'
      }
    };
    const wrapper = shallow(
      <TableRowComponent schema={{}} visibleColumns={visibleColumns}
        rowItem={rowItem} onRemoveClick={() => {}}
        onEditClick={() => {}} onCheckboxChange={() => {}}
        checkedAll={{}}
      />
    );

    wrapper.find(Popover).should.have.length(1);
    wrapper.find('button').should.have.length(1);
  });

  it('should contain 1 table cell with Link', () => {
    const visibleColumns = ['name'];
    const rowItem = {
      name: 'rowItem name',
      id: 0
    };
    const wrapper = shallow(
      <TableRowComponent schema={{}} visibleColumns={visibleColumns}
        rowItem={rowItem} onRemoveClick={() => {}}
        onEditClick={() => {}} onCheckboxChange={() => {}}
        checkedAll={{}}
      />
    );

    wrapper.find(Link).should.have.length(1);
  });

  it('should call onRemoveClick from handleRemoveClick', () => {
    const onRemoveClick = chai.spy();
    const rowItem = {};
    const wrapper = shallow(
      <TableRowComponent schema={{}} visibleColumns={[]}
        rowItem={rowItem} onRemoveClick={onRemoveClick}
        onEditClick={() => {}} onCheckboxChange={() => {}}
        checkedAll={{}}
      />
    );

    wrapper.find('.pt-icon-trash').at(0).simulate('click');
    onRemoveClick.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });

  it('should call onEditClick from handleEditClick', () => {
    const onEditClick = chai.spy();
    const rowItem = {};
    const wrapper = shallow(
      <TableRowComponent schema={{}} visibleColumns={[]}
        rowItem={rowItem} onRemoveClick={() => {}}
        onEditClick={onEditClick} onCheckboxChange={() => {}}
        checkedAll={{}}
      />
    );

    wrapper.find('.pt-icon-edit').at(0).simulate('click');
    onEditClick.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });

  it('should call onCheckboxChange from handleCheckboxChange', () => {
    const onCheckboxChange = chai.spy();
    const rowItem = {};
    const wrapper = shallow(
      <TableRowComponent schema={{}} visibleColumns={[]}
        rowItem={rowItem} onRemoveClick={() => {}}
        onEditClick={() => {}} onCheckboxChange={onCheckboxChange}
        checkedAll={{}}
      />
    );

    wrapper.find('input').at(0).simulate('change', {target: {checked: true}});
    onCheckboxChange.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });

  it('should change checkedRow state to false when rowItem\'s id has changed', () => {
    const rowItem = {
      id: 0
    };
    const wrapper = mount(
      <TableRowComponent schema={{}} visibleColumns={[]}
        rowItem={rowItem} onRemoveClick={() => {}}
        onEditClick={() => {}} onCheckboxChange={() => {}}
        checkedAll={{}}
      />
    );

    wrapper.setProps({
      rowItem: {
        id: 1
      }
    });
    wrapper.update();
    wrapper.state('checkedRow').should.equal(false);
  });

  it('should set checkedRow state when checkedAll checked changed and was not changed by row', () => {
    const checkedAll = {
      checked: false
    };
    const wrapper = mount(
      <TableRowComponent schema={{}} visibleColumns={[]}
        rowItem={{}} onRemoveClick={() => {}}
        onEditClick={() => {}} onCheckboxChange={() => {}}
        checkedAll={checkedAll}
      />
    );

    wrapper.setProps({
      checkedAll: {
        checked: true,
        changedByRow: false
      }
    });
    wrapper.update();
    wrapper.state('checkedRow').should.equal(true);
    // (true).should.equal(false);
  });
});
