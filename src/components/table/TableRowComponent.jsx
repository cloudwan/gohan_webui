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
  render() {
    const {schema, singular} = this.props.schema;
    const {schema: schemaDrop, item, ...propsForChildren} = this.props; // eslint-disable-line no-unused-vars
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
            iconStyle={{color: 'rgba(0, 0, 0, 0.55)'}}>
            <EditIcon />
          </IconButton>
          <IconButton tooltip="delete" tooltipPosition="bottom-right"
            iconStyle={{color: 'rgba(0, 0, 0, 0.55)'}}>
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
  schema: PropTypes.object.isRequired
};

export default TableRowComponent;
