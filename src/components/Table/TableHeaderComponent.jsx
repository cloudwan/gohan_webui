import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tooltip, Position} from '@blueprintjs/core';

class TableHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sortKey: this.props.sortKey,
      sortOrder: this.props.sortOrder,
      checkedAll: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checkedAll.checked === false) {
      this.setState({checkedAll: nextProps.checkedAll.checked});
    }

  }

  handleCheckedRowsInputChange = () => {
    const checkedAll = this.state.checkedAll;
    const checkedAllRows = {
      checked: !checkedAll,
      changedByRow: false
    };

    this.setState({checkedAll: !checkedAll}, () => {
      this.props.handleCheckAll(checkedAllRows);
    });
  };

  handleHeaderClick = event => {
    let sortKey = event.currentTarget.dataset.gohan;
    let sortOrder = 'asc';

    if (sortKey === this.state.sortKey && this.state.sortOrder === 'asc') {
      sortOrder = 'desc';
    } else if (sortKey === this.state.sortKey && this.state.sortOrder === 'desc') {
      sortKey = undefined;
      sortOrder = undefined;
    }

    this.setState({sortKey, sortOrder});

    this.props.sortData(sortKey, sortOrder);
  };

  buildTableHeaders = () => {
    const {properties, visibleColumns} = this.props;
    return visibleColumns.map((column, index) => {
      const property = properties[column];
      let sortIcon = <Tooltip content="Sort by this property." position={Position.RIGHT}>
        <span className={'hidden pt-icon-small pt-icon-sort'}/>
      </Tooltip>;

      if (this.state.sortKey === column) {
        sortIcon = (
          <Tooltip position={Position.RIGHT}
            content={this.state.sortOrder === 'asc' ? 'Sorted in ascending order.' : 'Sorted in descending order.'}>
            <span className={'pt-icon-small pt-icon-sort-' + this.state.sortOrder}/>
          </Tooltip>
        );
      }

      return (
        <th key={index}>
          <a onClick={this.handleHeaderClick} data-gohan={column}>
            <Tooltip content={property.description}><span>{property.title}</span></Tooltip>
            {sortIcon}
          </a>
        </th>
      );
    });

  };

  render() {
    return (
      <tr>
        <th key={-1} className="gohan-table-select-column">
          <input type="checkbox" onChange={this.handleCheckedRowsInputChange}
            checked={this.state.checkedAll}
          />
        </th>
        {this.buildTableHeaders()}
        <th className="options">{'Options'}</th>
      </tr>
    );
  }
}

TableHeader.contextTypes = {
  router: PropTypes.object
};

TableHeader.propTypes = {
  visibleColumns: PropTypes.array.isRequired,
  properties: PropTypes.object.isRequired,
  checkedAll: PropTypes.object.isRequired,
  handleCheckAll: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired
};

export default TableHeader;
