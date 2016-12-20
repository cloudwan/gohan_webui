import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import {
  TableRow,
  TableRowColumn,
  IconButton
} from 'material-ui';

const columnStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'normal'
};

const iconStyle = {
  color: 'rgba(0, 0, 0, 0.55)'
};

class TableRowComponent extends Component {
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
          <TableRowColumn key={index} style={columnStyle}>
            {JSON.stringify(data)}
          </TableRowColumn>
        );
      }
      if (item === 'name') {
        return (
          <TableRowColumn key={index} style={columnStyle}>
            <Link to={'/' + singular + '/' + rowItem.id}>{data}</Link>
          </TableRowColumn>
        );
      }

      return (
        <TableRowColumn key={index} style={columnStyle}>
          {data}
        </TableRowColumn>
      );
    });
  };


  render() {
    return (
      <TableRow className="row">
        {this.buildTableRow()}
        <TableRowColumn style={{padding: 0}}>
          <IconButton tooltip="edit" tooltipPosition="bottom-right"
            iconStyle={iconStyle} onClick={this.handleEditClick}>
            <EditIcon />
          </IconButton>
          <IconButton tooltip="delete" tooltipPosition="bottom-right"
            iconStyle={iconStyle} onClick={this.handleRemoveClick}>
            <DeleteIcon />
          </IconButton>
        </TableRowColumn>
      </TableRow>
    );
  }
}

TableRowComponent.contextTypes = {
  router: PropTypes.object
};

TableRowComponent.propTypes = {
  schema: PropTypes.object.isRequired,
  visibleColumns: PropTypes.array.isRequired,
  rowItem: PropTypes.object.isRequired,
  onRemoveClick: PropTypes.func,
  onEditClick: PropTypes.func
};

export default TableRowComponent;
