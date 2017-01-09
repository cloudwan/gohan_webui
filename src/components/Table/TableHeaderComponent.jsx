import React, {Component, PropTypes} from 'react';

class TableHeader extends Component {
  buildTableHeaders = () => {
    const {properties, visibleColumns} = this.props;

    return visibleColumns.map((item, index) => {
      const property = properties[item];

      return (
        <th key={index}>
          {property.title}
        </th>
      );
    });
  };

  render() {
    return (
      <tr>
        {this.buildTableHeaders()}
        <th >{'Options'}</th>
      </tr>
    );
  }
}

TableHeader.contextTypes = {
  router: PropTypes.object
};

TableHeader.propTypes = {
  visibleColumns: PropTypes.array.isRequired,
  properties: PropTypes.object.isRequired
};

export default TableHeader;
