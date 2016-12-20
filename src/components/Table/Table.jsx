import React, {Component, PropTypes} from 'react';
import {
  Paper,
  Table,
  TableHeader,
  TableBody
} from 'material-ui';
import TablePaginationComponent from './TablePaginationComponent';
import TableToolbarComponent from './TableToolbarComponent';
import TableHeaderComponent from './TableHeaderComponent.jsx';
import TableRowComponent from './TableRowComponent.jsx';

import Dialog from '../../Dialog/Dialog';

const detailStyle = {
  padding: 15
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

  buildTableBody = () => {
    return this.props.data.map((item, index) => {
      return (
        <TableRowComponent key={index} schema={this.props.schema}
          rowItem={item} onRemoveClick={this.handleRemoveItem}
          onEditClick={this.handleEditItem} visibleColumns={this.props.visibleColumns}
        />
      );
    });
  };


  render() {
    const {schema, singular} = this.props.schema;

    return (
      <Paper style={detailStyle}>
        <TableToolbarComponent handleOpenModal={this.handleOpenModal} singular={singular}
          options={schema.propertiesOrder} properties={schema.properties}
          filterData={this.props.filterData}
        />
        {this.ifShowModal()}

        <Table fixedHeader={true}>
          <TableHeader>
            <TableHeaderComponent visibleColumns={this.props.visibleColumns} properties={schema.properties}/>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {this.buildTableBody()}
          </TableBody>
        </Table>

        <TablePaginationComponent activePage={this.props.activePage} pageCount={this.props.pageCount}
          handlePageClick={this.handlePageClick}
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
  data: PropTypes.array.isRequired,
  visibleColumns: PropTypes.array.isRequired,
  pageCount: PropTypes.number,
  activePage: PropTypes.number,
  filterData: PropTypes.func
};

export default TableComponent;
