import React, {Component} from 'react';
import PaginationComponent from 'react-ultimate-pagination-material-ui';

class TablePaginationComponent extends Component {
  render() {
    let pagination = null;

    if (this.props.pageCount > 1) {
      pagination = <PaginationComponent currentPage={this.props.activePage} totalPages={this.props.pageCount}
        onChange={this.props.handlePageClick}
      />;
    }

    return (
      <div>
        {pagination}
      </div>
    );
  }
}

export default TablePaginationComponent;
