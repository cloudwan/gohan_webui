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
      data: {},
      openModal: false,
      actionModal: 'create'
    };
  }

  handleOpenModal = () => {
    this.setState({openModal: true, actionModal: 'create', data: {}});
  };

  handleCloseModal = () => {
    this.setState({openModal: false});
  };

  handleSubmit = (data, id) => {
    if (this.state.actionModal === 'create') {
      this.props.createData(data);
    } else if (this.state.actionModal === 'update') {
      this.props.updateData(id, data);
    }
  };
  handlePageClick = page => {
    this.props.handleChangePage(page);
  };

  handleRemoveItem = id => {
    this.props.removeData(this.props.schema.url, id);
  };

  handleEditItem = id => {
    this.setState({openModal: true, actionModal: 'update', data: id});
  };

  ifShowModal = () => {
    if (this.state.openModal) {
      return (
        <Dialog open={this.state.openModal} action={this.state.actionModal}
          onRequestClose={this.handleCloseModal} schema={this.props.schema}
          onSubmit={this.handleSubmit} data={this.state.data}
        />
      );
    }
    return null;
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
        {this.ifShowModal()}
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
        {(() => {
          if (this.props.pageCount > 1) {
            return (
              <PaginationComponent currentPage={this.props.activePage} totalPages={this.props.pageCount}
                onChange={this.handlePageClick}
              />
            );
          }
          return null;
        })()}
      </Paper>
    );
  }
}

TableComponent.contextTypes = {
  router: PropTypes.object
};

TableComponent.propTypes = {
  schema: PropTypes.object.isRequired,
  pageCount: PropTypes.number,
  activePage: PropTypes.number
};

export default TableComponent;
