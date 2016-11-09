import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LoadingIndicator from '../components/LoadingIndicator';
import Detail from '../components/Detail';
import {fetchData, clearData} from './DetailActions';

class DetailView extends Component {

  constructor(props) {
    super(props);

    const splitSplat = props.params.splat.split('/');
    const activeSchema = props.schemaReducer.data.find(
      object => object.singular === splitSplat[splitSplat.length - 2]
    );
    const childSchemas = props.schemaReducer.data.filter(
      object => object.parent === activeSchema.id
    );

    this.state = {
      activeSchema,
      childSchemas
    };
    this.props.fetchData(activeSchema.url + '/' + splitSplat[splitSplat.length - 1], activeSchema.singular);
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  render() {
    const {data, isLoading} = this.props.detailReducer;

    if (isLoading) {
      return (
        <LoadingIndicator/>
      );
    }

    return (
      <Detail schema={this.state.activeSchema} data={data} />
    );
  }
}

DetailView.propTypes = {
  schemaReducer: PropTypes.object.isRequired,
  detailReducer: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    schemaReducer: state.schemaReducer,
    detailReducer: state.detailReducer
  };
}

export default connect(mapStateToProps, {
  fetchData,
  clearData
})(DetailView);
