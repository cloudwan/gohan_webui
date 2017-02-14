/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import TableHeaderComponent from './TableHeaderComponent';

chai.use(chaiEnzyme());
chai.should();

describe('< TableHeaderComponent />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={[]} properties={{}}
        checkedAll={{}} handleCheckAll={() => {}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 table row', () => {
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={[]} properties={{}}
        checkedAll={{}} handleCheckAll={() => {}}
      />
    );

    wrapper.find('tr').should.have.length(1);
  });

  it('should contain 2 table header cells', () => {
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={[]} properties={{}}
        checkedAll={{}} handleCheckAll={() => {}}
      />
    );

    wrapper.find('th').should.have.length(2);
  });

  it('should contain 1 input', () => {
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={[]} properties={{}}
        checkedAll={{}} handleCheckAll={() => {}}
      />
    );

    wrapper.find('input').should.have.length(1);
  });

  it('should contain 4 table header cells', () => {
    const properties = {
      test1: {
        title: 'test1',
        description: 'test1 description'
      },
      test2: {
        title: 'test2',
        description: 'test2 description'
      }
    };
    const visibleColumns = ['test1', 'test2'];
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={visibleColumns} properties={properties}
        checkedAll={{}} handleCheckAll={() => {}}
        sortKey={'title'} sortOrder={'asc'}
        sortData={() => {}}
      />
    );

    wrapper.find('th').should.have.length(4);
    wrapper.find('Tooltip').should.have.length(4);
    wrapper.find('a').should.have.length(2);
  });

  it('should have initial state', () => {
    const properties = {
      test1: {
        title: 'test1',
        description: 'test1 description'
      },
      test2: {
        title: 'test2',
        description: 'test2 description'
      }
    };
    const visibleColumns = ['test1', 'test2'];
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={visibleColumns} properties={properties}
        checkedAll={{}} handleCheckAll={() => {}}
        sortKey={'title'} sortOrder={'asc'}
        sortData={() => {}}
      />
    );

    wrapper.state('sortKey').should.equal('title');
    wrapper.state('sortOrder').should.equal('asc');
    wrapper.state('checkedAll').should.equal(false);
  });

  it('should contain Tooltip with description about sorting ascending order', () => {
    const properties = {
      test1: {
        title: 'test1',
        description: 'test1 description'
      },
      test2: {
        title: 'test2',
        description: 'test2 description'
      }
    };
    const visibleColumns = ['test1', 'test2'];
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={visibleColumns} properties={properties}
        checkedAll={{}} handleCheckAll={() => {}}
        sortKey={'test1'} sortOrder={'asc'}
        sortData={() => {}}
      />
    );

    wrapper.find('Tooltip').filterWhere(item => {
      return item.node.props.content === 'Sorted in ascending order.';
    }).should.have.length(1);
  });

  it('should contain Tooltip with description about sorting descending order', () => {
    const properties = {
      test1: {
        title: 'test1',
        description: 'test1 description'
      },
      test2: {
        title: 'test2',
        description: 'test2 description'
      }
    };
    const visibleColumns = ['test1', 'test2'];
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={visibleColumns} properties={properties}
        checkedAll={{}} handleCheckAll={() => {}}
        sortKey={'test1'} sortOrder={'desc'}
        sortData={() => {}}
      />
    );

    wrapper.find('Tooltip').filterWhere(item => {
      return item.node.props.content === 'Sorted in descending order.';
    }).should.have.length(1);
  });

  it('should called componentWillReceiveProps', () => {
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={[]} properties={{}}
        checkedAll={{}} handleCheckAll={() => {}}
        sortData={() => {}}
      />
    );

    wrapper.setProps({
      checkedAll: {
        checked: false
      }
    });
    wrapper.state('checkedAll').should.equal(false);
  });

  it('should call handleCheckAll from handleCheckedRowsInputChange', () => {
    const handleCheckAll = chai.spy();
    const properties = {
      test1: {
        title: 'test1',
        description: 'test1 description'
      },
      test2: {
        title: 'test2',
        description: 'test2 description'
      }
    };
    const visibleColumns = ['test1', 'test2'];
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={visibleColumns} properties={properties}
        checkedAll={{}} handleCheckAll={handleCheckAll}
        sortData={() => {}}
      />
    );

    wrapper.find('input').at(0).simulate('change', {target: {checked: true}});
    handleCheckAll.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });

  it('should call sortData from handleHeaderClick', () => {
    const sortData = chai.spy();
    const properties = {
      test1: {
        title: 'test1',
        description: 'test1 description'
      },
      test2: {
        title: 'test2',
        description: 'test2 description'
      }
    };
    const visibleColumns = ['test1', 'test2'];
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={visibleColumns} properties={properties}
        checkedAll={{}} handleCheckAll={() => {}}
        sortData={sortData}
      />
    );

    wrapper.find('a').at(0).simulate('click', {currentTarget: {dataset: {gohan: 'test1'}}});
    sortData.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });

  it('should call sortData with descending sort order', () => {
    const sortData = chai.spy((sortKey, sortOrder) => {
      sortKey.should.equal('test1');
      sortOrder.should.equal('desc');
    });
    const properties = {
      test1: {
        title: 'test1',
        description: 'test1 description'
      },
      test2: {
        title: 'test2',
        description: 'test2 description'
      }
    };
    const visibleColumns = ['test1', 'test2'];
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={visibleColumns} properties={properties}
        checkedAll={{}} handleCheckAll={() => {}}
        sortData={sortData}
      />
    );
    wrapper.setState({
      sortOrder: 'asc',
      sortKey: 'test1'
    });

    wrapper.find('a').at(0).simulate('click', {currentTarget: {dataset: {gohan: 'test1'}}});
  });

  it('should call sortData with undefined sort parameters', () => {
    const sortData = chai.spy((sortKey, sortOrder) => {
      chai.expect(sortKey).equal(undefined);
      chai.expect(sortOrder).equal(undefined);
    });
    const properties = {
      test1: {
        title: 'test1',
        description: 'test1 description'
      },
      test2: {
        title: 'test2',
        description: 'test2 description'
      }
    };
    const visibleColumns = ['test1', 'test2'];
    const wrapper = shallow(
      <TableHeaderComponent visibleColumns={visibleColumns} properties={properties}
        checkedAll={{}} handleCheckAll={() => {}}
        sortData={sortData}
      />
    );
    wrapper.setState({
      sortOrder: 'desc',
      sortKey: 'test1'
    });

    wrapper.find('a').at(0).simulate('click', {currentTarget: {dataset: {gohan: 'test1'}}});
  });
});
