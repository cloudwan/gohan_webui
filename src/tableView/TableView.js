import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Table from '../components/Table';
import {fetchData, clearData} from './TableActions';
import LoadingIndicator from '../components/LoadingIndicator';

class TableView extends Component {

  constructor(props) {
    super(props);

    const splitSplat = props.params.splat.split('/');

    this.state = {
      activeSchema: props.schemaReducer.data.find(
        object => object.plural === splitSplat[splitSplat.length - 1]
      )
    };
    props.fetchData(this.state.activeSchema.url, this.state.activeSchema.plural);
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.props.clearData();

      const splitSplat = nextProps.params.splat.split('/');

      this.state = {
        activeSchema: this.props.schemaReducer.data.find(
          object => object.plural === splitSplat[splitSplat.length - 1]
        )
      };
      this.props.fetchData(this.state.activeSchema.url, this.state.activeSchema.plural);
    }
  }

  render() {
    const {isLoading, data} = this.props.tableReducer;

    if (isLoading) {
      return (
        <LoadingIndicator />
      );
    }
    return (
      <Table schema={this.state.activeSchema} data={data} />
    );
  }
}

TableView.propTypes = {
  schemaReducer: PropTypes.object.isRequired,
  tableReducer: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    schemaReducer: state.schemaReducer,
    tableReducer: state.tableReducer
  };
}

export default connect(mapStateToProps, {
  fetchData,
  clearData
})(TableView);
