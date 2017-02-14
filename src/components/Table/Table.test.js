/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import Breadcrumb from '../Breadcrumb';
import TableHeaderComponent from './TableHeaderComponent';
import TablePaginationComponent from './TablePaginationComponent';
import TableRowComponent from './TableRowComponent';
import Table from './Table';

chai.use(chaiEnzyme());
chai.should();

describe('< Table />', () => {
  const schema = {
    schema: {
      propertiesOrder: ['prop1', 'prop2'],
      properties: {
        prop1: {},
        prop2: {}
      }
    },
    singular: 'singular'
  };

  it('should exist', () => {
    const wrapper = shallow(
      <Table schema={schema} data={[]}
        visibleColumns={[]} pageCount={0}
        activePage={1} filterData={() => {}}
        sortData={() => {}} editData={() => {}}
        openModal={() => {}} handlePageChange={() => {}}
        rowCheckboxChange={() => {}} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} openAlert={() => {}}
        checkedAll={{}} handleCheckAll={() => {}}
        filterValue={''} filterBy={''}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 div', () => {
    const wrapper = shallow(
      <Table schema={schema} data={[]}
        visibleColumns={[]} pageCount={0}
        activePage={1} filterData={() => {}}
        sortData={() => {}} editData={() => {}}
        openModal={() => {}} handlePageChange={() => {}}
        rowCheckboxChange={() => {}} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} openAlert={() => {}}
        checkedAll={{}} handleCheckAll={() => {}}
        filterValue={''} filterBy={''}
      />
    );

    wrapper.find('div').should.have.length(1);
  });

  it('should contain 1 table', () => {
    const wrapper = shallow(
      <Table schema={schema} data={[]}
        visibleColumns={[]} pageCount={0}
        activePage={1} filterData={() => {}}
        sortData={() => {}} editData={() => {}}
        openModal={() => {}} handlePageChange={() => {}}
        rowCheckboxChange={() => {}} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} openAlert={() => {}}
        checkedAll={{}} handleCheckAll={() => {}}
        filterValue={''} filterBy={''}
      />
    );

    wrapper.find('table').should.have.length(1);
  });

  it('should contain 1 table head', () => {
    const wrapper = shallow(
      <Table schema={schema} data={[]}
        visibleColumns={[]} pageCount={0}
        activePage={1} filterData={() => {}}
        sortData={() => {}} editData={() => {}}
        openModal={() => {}} handlePageChange={() => {}}
        rowCheckboxChange={() => {}} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} openAlert={() => {}}
        checkedAll={{}} handleCheckAll={() => {}}
        filterValue={''} filterBy={''}
        singular={'singular'}
      />
    );

    wrapper.find('thead').should.have.length(1);
  });

  it('should contain 1 table body', () => {
    const wrapper = shallow(
      <Table schema={schema} data={[]}
        visibleColumns={[]} pageCount={0}
        activePage={1} filterData={() => {}}
        sortData={() => {}} editData={() => {}}
        openModal={() => {}} handlePageChange={() => {}}
        rowCheckboxChange={() => {}} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} openAlert={() => {}}
        checkedAll={{}} handleCheckAll={() => {}}
        filterValue={''} filterBy={''}
        singular={'singular'}
      />
    );

    wrapper.find('tbody').should.have.length(1);
  });

  it('should contain 1 TableHeaderComponent', () => {
    const wrapper = shallow(
      <Table schema={schema} data={[]}
        visibleColumns={[]} pageCount={0}
        activePage={1} filterData={() => {}}
        sortData={() => {}} editData={() => {}}
        openModal={() => {}} handlePageChange={() => {}}
        rowCheckboxChange={() => {}} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} openAlert={() => {}}
        checkedAll={{}} handleCheckAll={() => {}}
        filterValue={''} filterBy={''}
        singular={'singular'}
      />
    );

    wrapper.find(TableHeaderComponent).should.have.length(1);
  });

  it('should contain 1 Breadcrumb', () => {
    const wrapper = shallow(
      <Table schema={schema} data={[]}
        visibleColumns={[]} pageCount={0}
        activePage={1} filterData={() => {}}
        sortData={() => {}} editData={() => {}}
        openModal={() => {}} handlePageChange={() => {}}
        rowCheckboxChange={() => {}} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} openAlert={() => {}}
        checkedAll={{}} handleCheckAll={() => {}}
        filterValue={''} filterBy={''}
        singular={'singular'}
      />
    );

    wrapper.find(Breadcrumb).should.have.length(1);
  });

  it('should contain 1 TablePaginationComponent', () => {
    const wrapper = shallow(
      <Table schema={schema} data={[]}
        visibleColumns={[]} pageCount={0}
        activePage={1} filterData={() => {}}
        sortData={() => {}} editData={() => {}}
        openModal={() => {}} handlePageChange={() => {}}
        rowCheckboxChange={() => {}} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} openAlert={() => {}}
        checkedAll={{}} handleCheckAll={() => {}}
        filterValue={''} filterBy={''}
        singular={'singular'}
      />
    );

    wrapper.find(TablePaginationComponent).should.have.length(1);
  });

  it('should contain 1 TableRowComponent', () => {
    const data = [
      {
        id: 0
      }
    ];
    const wrapper = shallow(
      <Table schema={schema} data={data}
        visibleColumns={[]} pageCount={0}
        activePage={1} filterData={() => {}}
        sortData={() => {}} editData={() => {}}
        openModal={() => {}} handlePageChange={() => {}}
        rowCheckboxChange={() => {}} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} openAlert={() => {}}
        checkedAll={{}} handleCheckAll={() => {}}
        filterValue={''} filterBy={''}
        singular={'singular'}
      />
    );

    wrapper.find(TableRowComponent).should.have.length(1);
  });
});
