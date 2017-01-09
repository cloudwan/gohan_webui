import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import {Tooltip} from '@blueprintjs/core';

class TableRow extends Component {
  handleRemoveClick = () => {
    const {rowItem} = this.props;

    this.props.onRemoveClick(rowItem.id);
  };

  handleEditClick = () => {
    const {rowItem} = this.props;

    this.props.onEditClick(rowItem);
  };

  buildTableRow = () => {
    const {visibleColumns, rowItem} = this.props;
    const {singular} = this.props.schema;

    return visibleColumns.map((item, index) => {
      const data = rowItem[item];

      if (typeof data === 'object') {
        return (
          <td key={index}>
            {data === null ? '' : JSON.stringify(data)}
          </td>
        );
      }
      if (item === 'name') {
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
  onRemoveClick: PropTypes.func,
  onEditClick: PropTypes.func
};

export default TableRow;
