import React, {Component, PropTypes} from 'react';
import {
  Paper,
  RefreshIndicator,
  Table,
  TableHeader,
  TableBody,
  RaisedButton
} from 'material-ui';
import PaginationComponent from 'react-ultimate-pagination-material-ui';
import TableHeaderComponent from './TableHeaderComponent.jsx';
import TableRowComponent from './TableRowComponent.jsx';

import Dialog from '../../dialog/Dialog';


const detailStyle = {
  padding: 15
};
const loadingIndicatorStyle = {
  margin: 'auto',
  position: 'relative'
};

class TableComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      actionModal: 'create'
    };
  }

  handleOpenModal = () => {
    this.setState({openModal: true, actionModal: 'create'});
  };

  handleCloseModal = () => {
    this.setState({openModal: false});
  };

  handleSubmit = data => {
    this.props.createData(data);
  };
  handlePageClick = () => {

  };

  handleRemoveItem = id => {
    this.props.removeData(this.props.schema.url, id);
  };

  handleEditItem = () => {
    console.log('handleEditItem');
  };

  render() {
    const {schema, singular} = this.props.schema;

    if (this.props.isLoading) {
      return (
        <RefreshIndicator size={60} left={0}
          top={0} status="loading"
          style={loadingIndicatorStyle}
        />
      );
    }
    return (
      <Paper style={detailStyle}>
        <RaisedButton onClick={this.handleOpenModal}
          label={'Add new ' + singular}
          style={{margin: '8px 8px 8px 8px', marginRight: 'auto'}}
          primary={true}
        />
        <Dialog open={this.state.openModal} action={this.state.actionModal}
          onRequestClose={this.handleCloseModal} schema={this.props.schema}
          onSubmit={this.handleSubmit}
        />
        <Table fixedHeader={true}>
          <TableHeader>
            <TableHeaderComponent schema={schema}/>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {this.props.data.map((item, index) => (
              <TableRowComponent key={index} schema={this.props.schema}
                item={item} onRemoveClick={this.handleRemoveItem}
                onEditClick={this.handleEditItem}
              />
            ))}
          </TableBody>
        </Table>
        <PaginationComponent currentPage={1}
          totalPages={10}
          onchange={this.handlePageClick}
        />
      </Paper>
    );
  }
}

TableComponent.contextTypes = {
  router: PropTypes.object
};

TableComponent.propTypes = {
  schema: PropTypes.object.isRequired,
};

export default TableComponent;
