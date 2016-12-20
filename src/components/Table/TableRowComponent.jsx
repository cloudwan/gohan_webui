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

class TableRowComponent extends Component {

  handleRemoveClick = () => {
    const {item} = this.props;

    this.props.onRemoveClick(item.id);
  };

  handleEditClick = () => {
    const {item} = this.props;

    this.props.onEditClick(item);
  };


  render() {
    const {schema, singular} = this.props.schema;
    const {schema: schemaDrop, onRemoveClick, onEditClick, visibleColumns, // eslint-disable-line no-unused-vars
      item, ...propsForChildren} = this.props;

    return (
      <TableRow className="row" {...propsForChildren}>
        {schema.propertiesOrder.map((key, i) => {
          const data = item[key];
          const property = schema.properties[key];

          if (property && property.view && !property.view.includes('list')) {
            return null;
          }

          if (key === 'id') {
            return null;
          }
          if (typeof data === 'object') {
            return (
              <TableRowColumn key={i} style={columnStyle}>{JSON.stringify(data)}</TableRowColumn>
            );
          }
          if (key === 'name') {
            return (
              <TableRowColumn key={i} style={columnStyle}>
                <Link to={'/' + singular + '/' + item.id}>{data}</Link>
              </TableRowColumn>
            );
          }
          return (
            <TableRowColumn key={i} style={columnStyle}>{data}</TableRowColumn>
          );
        })}
        <TableRowColumn style={{padding: 0}}>
          <IconButton tooltip="edit" tooltipPosition="bottom-right"
            iconStyle={{color: 'rgba(0, 0, 0, 0.55)'}} onClick={this.handleEditClick}>
            <EditIcon />
          </IconButton>
          <IconButton tooltip="delete" tooltipPosition="bottom-right"
            iconStyle={{color: 'rgba(0, 0, 0, 0.55)'}} onClick={this.handleRemoveClick}>
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
  onRemoveClick: PropTypes.func,
  onEditClick: PropTypes.func
};

export default TableRowComponent;
