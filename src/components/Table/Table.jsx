import React, {Component, PropTypes} from 'react';
import TablePaginationComponent from './TablePaginationComponent';
import TableToolbarComponent from './TableToolbarComponent';
import TableHeaderComponent from './TableHeaderComponent.jsx';
import TableRowComponent from './TableRowComponent.jsx';
import Breadcrumb from '../Breadcrumb';

class Table extends Component {
  buildTableBody = () => {
    return this.props.data.map((item, index) => {
      return (
        <TableRowComponent key={index} schema={this.props.schema}
          rowItem={item} onRemoveClick={this.props.openAlert}
          onEditClick={this.props.editData} visibleColumns={this.props.visibleColumns}
        />
      );
    });
  };


  render() {
    const {schema, singular} = this.props.schema;
    return (
      <div className={'pt-card pt-elevation-3'}>
        <Breadcrumb breadcrumbs={[singular]}/>
        <TableToolbarComponent filterBy={this.props.filterBy} filterValue={this.props.filterValue}
          handleOpenModal={this.props.openModal} singular={singular}
          options={schema.propertiesOrder} properties={schema.properties}
          filterData={this.props.filterData} filterProperties={this.props.visibleColumns}
        />

        <table className={'table pt-table pt-interactive'}>
          <thead>
            <TableHeaderComponent visibleColumns={this.props.visibleColumns} properties={schema.properties}
              sortData={this.props.sortData} sortKey={this.props.sortKey}
              sortOrder={this.props.sortOrder}
            />
          </thead>
          <tbody>
            {this.buildTableBody()}
          </tbody>
        </table>

        <TablePaginationComponent activePage={this.props.activePage} pageCount={this.props.pageCount}
          handlePageClick={this.props.handlePageChange}
        />
      </div>
    );
  }
}

Table.contextTypes = {
  router: PropTypes.object
};

Table.propTypes = {
  schema: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  visibleColumns: PropTypes.array.isRequired,
  pageCount: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  filterData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  editData: PropTypes.func.isRequired,
  removeData: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired
};

export default Table;
