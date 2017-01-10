import React, {Component, PropTypes} from 'react';
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
    let mappedVisibleColumns = visibleColumns.map((item, index) => {
      const property = properties[item];
      let sortIcon = <Tooltip content="Sort by this property." position={Position.RIGHT}>
        <span className={'hidden pt-icon-small pt-icon-sort'}/>
      </Tooltip>;

      if (this.state.sortKey === item) {
        sortIcon = <Tooltip content={this.state.sortOrder === 'asc' ?
          'Sorted in ascending order.' :
          'Sorted in descending order.'}
          position={Position.RIGHT}>
          <span className={'pt-icon-small pt-icon-sort-' + this.state.sortOrder}/>
        </Tooltip>;
      }

      return (
        <th key={index}>
          <a onClick={this.handleHeaderClick} data-gohan={item}>
            <Tooltip content={property.description}><span>{property.title}</span></Tooltip>
            {sortIcon}
          </a>
        </th>
      );
    });

    mappedVisibleColumns.unshift(
      <th key={-1}>
        <input type="checkbox" onChange={this.handleCheckedRowsInputChange}
          checked={this.state.checkedAll}
        />
      </th>
    );

    return mappedVisibleColumns;
  };

  render() {
    return (
      <tr>
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
  handleCheckAll: PropTypes.func.isRequired
};

export default TableHeader;
