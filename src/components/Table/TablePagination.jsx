import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';

class TablePaginationComponent extends Component {

  handlePageChange = ({selected}) => {
    this.props.handlePageClick(selected);
  };

  render() {
    let pagination = null;

    const {
      pageCount,
      activePage,
      ...additionalProps
    } = this.props;

    if (this.props.pageCount > 1) {
      pagination = (
        <ReactPaginate previousLabel={'«'}
          nextLabel={'»'} breakLabel={<a>...</a>}
          breakClassName={'page-item disabled'}
          breakLinkClassName={'page-link'}
          initialPage={activePage}
          forcePage={activePage}
          pageCount={pageCount} marginPagesDisplayed={2}
          pageRangeDisplayed={5} onPageChange={this.handlePageChange}
          containerClassName={'pagination pagination-sm'}
          activeClassName={'active'}
          pageClassName={'page-item'} pageLinkClassName={'page-link'}
          previousClassName={'page-item'} nextClassName={'page-item'}
          previousLinkClassName={'page-link'} nextLinkClassName={'page-link'}
          disabledClassName={'disabled'} disableInitialCallback={true}
          {...additionalProps}
        />
      );
    }

    return (
      <div>
        {pagination}
      </div>
    );
  }
}


export default TablePaginationComponent;
