/* global it, describe */
import React from 'react';
import ReactPaginate from 'react-paginate';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import TablePaginationComponent from './TablePaginationComponent';

chai.use(chaiEnzyme());
chai.use(spies);
chai.should();

describe('< TablePaginationComponent />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <TablePaginationComponent/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 div', () => {
    const wrapper = shallow(
      <TablePaginationComponent/>
    );

    wrapper.find('div').should.have.length(1);
  });

  it('should contain 1 ReactPaginate', () => {
    const wrapper = shallow(
      <TablePaginationComponent pageCount={2} />
    );

    wrapper.find(ReactPaginate).should.have.length(1);
  });

  it('should call handlePageClick', () => {
    const handlePageClick = chai.spy();
    const wrapper = mount(
      <TablePaginationComponent pageCount={2} handlePageClick={handlePageClick}/>
    );

    wrapper.find('a').at(2).simulate('click');
    handlePageClick.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });
});
