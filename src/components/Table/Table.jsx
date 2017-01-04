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
import Breadcrumb from '../Breadcrumb';

const detailStyle = {
  padding: 15
};

class TableComponent extends Component {
  buildTableBody = () => {
    return this.props.data.map((item, index) => {
      return (
        <TableRowComponent key={index} schema={this.props.schema}
          rowItem={item} onRemoveClick={this.props.removeData}
          onEditClick={this.props.editData} visibleColumns={this.props.visibleColumns}
        />
      );
    });
  };


  render() {
    const {schema, singular} = this.props.schema;
    return (
      <Paper style={detailStyle}>
        <Breadcrumb breadcrumbs={[singular]}/>
        <TableToolbarComponent handleOpenModal={this.props.openModal} singular={singular}
          options={schema.propertiesOrder} properties={schema.properties}
          filterData={this.props.filterData} filterProperties={this.props.visibleColumns}
        />

        <Table fixedHeader={true}>
          <TableHeader>
            <TableHeaderComponent visibleColumns={this.props.visibleColumns} properties={schema.properties}/>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {this.buildTableBody()}
          </TableBody>
        </Table>

        <TablePaginationComponent activePage={this.props.activePage} pageCount={this.props.pageCount}
          handlePageClick={this.props.handleChangePage}
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
  pageCount: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  filterData: PropTypes.func.isRequired,
  editData: PropTypes.func.isRequired,
  removeData: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired
};

export default TableComponent;
