import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import {Tooltip} from '@blueprintjs/core';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedRow: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.rowItem.id !== nextProps.rowItem.id) {
      this.setState({checkedRow: false});
    }

    if (this.props.checkedAll.checked !== nextProps.checkedAll.checked && nextProps.checkedAll.changedByRow === false) {
      this.setState({checkedRow: nextProps.checkedAll.checked});
    }
  }

  handleRemoveClick = () => {
    const {rowItem} = this.props;

    this.props.onRemoveClick(rowItem);
  };

  handleEditClick = () => {
    const {rowItem} = this.props;

    this.props.onEditClick(rowItem);
  };

  handleCheckboxChange = () => {
    const {rowItem} = this.props;

    this.setState({checkedRow: !this.state.checkedRow}, () => {
      this.props.onCheckboxChange(rowItem.id, this.state.checkedRow);
    });
  };

  buildTableRow = () => {
    const {visibleColumns, rowItem} = this.props;
    const {singular} = this.props.schema;
    return visibleColumns.map((column, index) => {
      const data = rowItem[column];

      if (typeof data === 'object') {
        return (
          <td key={index}>
            {data === null ? '' : JSON.stringify(data)}
          </td>
        );
      }
      if (column === 'name') {
        return (
          <td key={index}>
            <Link to={'/' + singular + '/' + rowItem.id}>{data}</Link>
          </td>
        );
      }

      return (
        <td key={index}>
          {data}
        </td>
      );
    });
  };


  render() {
    return (
      <tr className="row">
        <td key={this.props.rowItem.id}>
          <input type="checkbox" onChange={this.handleCheckboxChange}
            checked={this.state.checkedRow}
          />
        </td>
        {this.buildTableRow()}
        <td>
          <Tooltip content='Edit' hoverOpenDelay={50}>
            <span className="pt-icon-standard pt-icon-edit" onClick={this.handleEditClick}/>
          </Tooltip>
          <Tooltip content='Delete' hoverOpenDelay={50}>
            <span className="pt-icon-standard pt-icon-trash" onClick={this.handleRemoveClick}
              style={{marginLeft: '15px'}}
            />
          </Tooltip>
        </td>
      </tr>
    );
  }
}

TableRow.contextTypes = {
  router: PropTypes.object
};

TableRow.propTypes = {
  schema: PropTypes.object.isRequired,
  visibleColumns: PropTypes.array.isRequired,
  rowItem: PropTypes.object.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  checkedAll: PropTypes.object.isRequired
};

export default TableRow;
