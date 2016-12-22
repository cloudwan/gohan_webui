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
  buildTableHeaders = () => {
    const {properties, visibleColumns} = this.props;

    return visibleColumns.map((item, index) => {
      const property = properties[item];

      return (
        <TableHeaderColumn key={index} tooltip={property.description}
          style={columnStyle}>
          {property.title}
        </TableHeaderColumn>
      );
    });
  };

  render() {
    return (
      <TableRow selectable={false}>
        {this.buildTableHeaders()}
        <TableHeaderColumn >{'Options'}</TableHeaderColumn>
      </TableRow>
    );
  }
}

TableHeaderComponent.contextTypes = {
  router: PropTypes.object
};

TableHeaderComponent.propTypes = {
  visibleColumns: PropTypes.array.isRequired,
  properties: PropTypes.object.isRequired
};

export default TableHeaderComponent;
