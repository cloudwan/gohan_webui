import React, {Component, PropTypes} from 'react';
import {
  TableRow,
  TableHeaderColumn
} from 'material-ui';

const columnStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'normal'
};

class TableHeaderComponent extends Component {
  render() {
    const schema = this.props.schema;

    return (
      <TableRow selectable={false}>
        {schema.propertiesOrder.map((item, index) => {
          const property = schema.properties[item];

          if (property && property.view && !property.view.includes('list')) {
            return null;
          }
          if (item === 'id') {
            return null;
          }
          return (
            <TableHeaderColumn key={index}
              tooltip={property.description}
              style={columnStyle}>{property.title}
            </TableHeaderColumn>
          );
        })}
        <TableHeaderColumn >{'Options'}</TableHeaderColumn>
      </TableRow>
    );
  }
}

TableHeaderComponent.contextTypes = {
  router: PropTypes.object
};

TableHeaderComponent.propTypes = {
  schema: PropTypes.object.isRequired
};

export default TableHeaderComponent;
