/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {shallow, mount} from 'enzyme';

import TableComponent from './index';
import TableHeaderCell from './CellComponents/TableHeaderCell';
import {MemoryRouter} from 'react-router-dom';

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.should();

describe('< TableComponent />', () => {
  it('should exists', () => {
    const props = {
      sortOptions: {},
      data: [],
      columns: [],
      checkboxColumn: {},
      optionsColumn: {}
    };
    const wrapper = shallow(<MemoryRouter><TableComponent {...props}/></MemoryRouter>);

    wrapper.should.not.be.equal(undefined);
  });

  it('should call onCheckboxClick() from row checkbox', () => {
    const onCheckboxClick = sinon.spy();
    const props = {
      sortOptions: {},
      data: [{
        id: 'id',
        name: 'name'
      }],
      columns: [{
        id: 'name',
        title: 'name',
        type: 'string'
      }],
      checkboxColumn: {
        visible: true,
        onCheckboxClick,
        checkedItems: []
      },
      optionsColumn: {}
    };
    const wrapper = mount(<MemoryRouter><TableComponent {...props}/></MemoryRouter>);

    wrapper.find('input').should.have.length(2);
    wrapper.find('input').at(1).simulate('change');

    onCheckboxClick.should.callCount(1);
  });

  it('should call onCheckboxClick() from header row checkbox', () => {
    const onCheckboxClick = sinon.spy();
    const props = {
      sortOptions: {},
      data: [{
        id: 'id',
        name: 'name'
      }],
      columns: [{
        id: 'name',
        title: 'name',
        type: 'string'
      }],
      checkboxColumn: {
        visible: true,
        onCheckboxClick,
        checkedItems: []
      },
      optionsColumn: {}
    };
    const wrapper = mount(<MemoryRouter><TableComponent {...props}/></MemoryRouter>);

    wrapper.find('input').should.have.length(2);
    wrapper.find('input').at(0).simulate('change');

    onCheckboxClick.should.callCount(1);
  });

  it('should call sort onChange()', () => {
    const onSortChange = sinon.spy();
    const props = {
      sortOptions: {
        onChange: onSortChange
      },
      data: [{
        id: 'id',
        name: 'name'
      }],
      columns: [{
        id: 'name',
        title: 'name',
        type: 'string'
      }],
      checkboxColumn: {},
      optionsColumn: {}
    };
    const wrapper = mount(<MemoryRouter><TableComponent {...props}/></MemoryRouter>);

    wrapper.find(TableHeaderCell).should.have.length(2);
    wrapper.find('a').at(0).simulate('click');

    onSortChange.should.callCount(1);
  });

  it('should call edit onClick()', () => {
    const onEditClick = sinon.spy();
    const props = {
      sortOptions: {},
      data: [{
        id: 'id',
        name: 'name'
      }],
      columns: [{
        id: 'name',
        title: 'name',
        type: 'string'
      }],
      checkboxColumn: {},
      optionsColumn: {
        edit: {
          visible: true,
          onClick: onEditClick
        }
      }
    };
    const wrapper = mount(<MemoryRouter><TableComponent {...props}/></MemoryRouter>);

    wrapper.find('.action-icon.edit').should.have.length(1);
    wrapper.find('.action-icon.edit').at(0).simulate('click');

    onEditClick.should.callCount(1);
  });

  it('should call remove onClick()', () => {
    const onRemoveClick = sinon.spy();
    const props = {
      sortOptions: {},
      data: [{
        id: 'id',
        name: 'name'
      }],
      columns: [{
        id: 'name',
        title: 'name',
        type: 'string'
      }],
      checkboxColumn: {},
      optionsColumn: {
        remove: {
          visible: true,
          onClick: onRemoveClick
        }
      }
    };
    const wrapper = mount(<MemoryRouter><TableComponent {...props}/></MemoryRouter>);

    wrapper.find('.action-icon.delete').should.have.length(1);
    wrapper.find('.action-icon.delete').at(0).simulate('click');

    onRemoveClick.should.callCount(1);
  });
});
