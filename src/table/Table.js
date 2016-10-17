import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
// import Dialog from './../dialog/Dialog';

import {
  Paper,
  Table,
  TableBody,
  TableRow,
  TableHeaderColumn,
  TableRowColumn,
  RaisedButton,
} from 'material-ui';

const columnStyle = {
  wordWrap: 'break-word',
  whiteSpace: 'normal'
};

class TableComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      actionModal: 'create'
    };
  }

  componentWillUnmount() {
  }

  handleOpenModal = () => {
    this.setState({openModal: true, actionModal: 'create'});
  };

  handleCloseModal = () => {
    this.setState({openModal: false});
  };

  handleSubmit = data => {
    this.props.createData(this.props.schema.url, data, this.props.schema.singular);
  };

  render() {
    console.log('rendering table');
    const {schema} = this.props.schema;

    if (this.props.isLoading || !Array.isArray(this.props.data)) {
      return (
        <div>Loading...</div>
      );
    }
    return (
      <Paper style={{marginLeft: '290px'}}>
        <RaisedButton onClick={this.handleOpenModal}
          primary={true}
          label={'+ new'}
          style={{margin: '8px 8px 8px 8px', marginRight: 'auto'}}
        />
        <Table style={{tableLayout: 'auto'}}>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
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
                    style={columnStyle}>{property.title}</TableHeaderColumn>
                );
              })}
            </TableRow>
            {this.props.data.map((item, index) => (
              <TableRow key={index}>
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
                        <Link to={'/' + this.props.schema.singular + '/' + item.id}>{data}</Link>
                      </TableRowColumn>
                    );
                  }
                  return (
                    <TableRowColumn key={i} style={columnStyle}>{data}</TableRowColumn>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

TableComponent.contextTypes = {
  router: PropTypes.object
};

function mapStateToProps() {
  return {};
}

TableComponent.propTypes = {
  schema: PropTypes.object.isRequired
};

export default connect(mapStateToProps, {
})(TableComponent);
