/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';
import {shallow, mount} from 'enzyme';

import TableComponent from './index';
import Table from './Table';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableHeaderCell from './CellComponents/TableHeaderCell';

chai.use(spies);
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
    const wrapper = shallow(<TableComponent {...props}/>);

    wrapper.should.not.be.equal(undefined);
  });

  it('should contain basic table components', () => {
    const props = {
      sortOptions: {},
      data: [],
      columns: [],
      checkboxColumn: {},
      optionsColumn: {}
    };
    const wrapper = shallow(<TableComponent {...props}/>);

    wrapper.find(Table).should.have.length(1);
    wrapper.find(TableHeader).should.have.length(1);
    wrapper.find(TableBody).should.have.length(1);
  });

  it('should call onCheckboxClick() from row checkbox', () => {
    const onCheckboxClick = chai.spy();
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
    const wrapper = mount(<TableComponent {...props}/>);

    wrapper.find('input').should.have.length(2);
    wrapper.find('input').at(1).simulate('change');

    onCheckboxClick.should.have.been.called.once; // eslint-disable-line
  });

  it('should call onCheckboxClick() from header row checkbox', () => {
    const onCheckboxClick = chai.spy();
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
    const wrapper = mount(<TableComponent {...props}/>);

    wrapper.find('input').should.have.length(2);
    wrapper.find('input').at(0).simulate('change');

    onCheckboxClick.should.have.been.called.once; // eslint-disable-line
  });

  it('should call sort onChange()', () => {
    const onSortChange = chai.spy();
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
    const wrapper = mount(<TableComponent {...props}/>);

    wrapper.find(TableHeaderCell).should.have.length(2);
    wrapper.find('a').at(0).simulate('click');

    onSortChange.should.have.been.called.once; // eslint-disable-line
  });

  it('should call edit onClick()', () => {
    const onEditClick = chai.spy();
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
    const wrapper = mount(<TableComponent {...props}/>);

    wrapper.find('.pt-icon-edit').should.have.length(1);
    wrapper.find('.pt-icon-edit').at(0).simulate('click');

    onEditClick.should.have.been.called.once; // eslint-disable-line
  });

  it('should call remove onClick()', () => {
    const onRemoveClick = chai.spy();
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
    const wrapper = mount(<TableComponent {...props}/>);

    wrapper.find('.pt-icon-trash').should.have.length(1);
    wrapper.find('.pt-icon-trash').at(0).simulate('click');

    onRemoveClick.should.have.been.called.once; // eslint-disable-line
  });
});
