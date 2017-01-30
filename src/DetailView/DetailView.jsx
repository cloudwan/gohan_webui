import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import LoadingIndicator from '../components/LoadingIndicator';
import Detail from '../components/Detail';
import Dialog from '../Dialog/Dialog';
import {
  initialize,
  fetchData,
  clearData,
  pollData,
  cancelPollData,
  deleteData,
  updateData
} from './DetailActions';
import {Alert, Intent} from '@blueprintjs/core';

class DetailView extends Component {

  constructor(props) {
    super(props);

    const splitPathname = props.location.pathname.split('/');
    const activeSchema = props.schemaReducer.data.find(
      object => object.singular === splitPathname[splitPathname.length - 2]
    );
    const childSchemas = props.schemaReducer.data.filter(
      object => object.parent === activeSchema.id
    );
    const detail = splitPathname[splitPathname.length - 1];
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    this.state = {
      activeSchema,
      childSchemas,
      detail,
      source,
      modalOpen: false,
      alertOpen: false,
      actionModal: 'update',
      dialogData: {}
    };

    props.initialize(activeSchema.url + '/' + detail, activeSchema.singular);

    props.fetchData();
  }

  componentDidMount() {

    if (this.props.configReducer.polling) {
      this.pollData();
    }
  }

  componentWillUnmount() {
    this.state.source.cancel();
    this.props.cancelPollData();
    this.props.clearData();
  }

  handleEdit = id => {
    this.setState({modalOpen: true, actionModal: 'update', dialogData: id});
  };

  handleDelete = () => {
    this.props.deleteData();
    this.handleCloseAlert();
  };

  handleOpenModal = () => {
    this.setState({modalOpen: true, actionModal: 'create', dialogData: {}});
  };

  handleCloseModal = () => {
    this.setState({modalOpen: false});
  };

  handleOpenAlert = () => {
    this.setState({alertOpen: true});
  };

  handleCloseAlert = () => {
    this.setState({alertOpen: false});
  };

  handleSubmit = (data) => {
    switch (this.state.actionModal) {
      case 'create':
        this.props.createData(data);
        break;
      case 'update':
        this.props.updateData(data);
        break;
    }
  };

  showModal = () => {
    if (this.state.modalOpen) {
      return (
        <Dialog isOpen={this.state.modalOpen} action={this.state.actionModal}
          data={this.state.dialogData} onClose={this.handleCloseModal}
          onSubmit={this.handleSubmit} schema={this.state.activeSchema}
        />
      );
    }

    return null;
  };

  showAlert = () => {
    if (this.state.alertOpen) {
      return (
        <Alert intent={Intent.PRIMARY}
          isOpen={this.state.alertOpen}
          confirmButtonText='Delete'
          cancelButtonText='Cancel'
          onConfirm={this.handleDelete}
          onCancel={this.handleCloseAlert}>
          <p>Delete?</p>
        </Alert>
      );
    }
  };

  render() {
    const {data, isLoading} = this.props.detailReducer;

    if (isLoading) {
      return (
        <LoadingIndicator/>
      );
    }

    return (
      <div className="detail-container">
        {this.showModal()}
        {this.showAlert()}
        <Detail schema={this.state.activeSchema} data={data}
          onEdit={this.handleEdit} onDelete={this.handleOpenAlert}
        />
      </div>
    );
  }

  pollData() {
    const {detail, activeSchema, source} = this.state;
    this.props.pollData(activeSchema.url + '/' + detail, activeSchema.singular, source.token);
  }
}

DetailView.propTypes = {
  schemaReducer: PropTypes.object.isRequired,
  detailReducer: PropTypes.object.isRequired,
  configReducer: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired,
  cancelPollData: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    schemaReducer: state.schemaReducer,
    detailReducer: state.detailReducer,
    configReducer: state.configReducer
  };
}


export default connect(mapStateToProps, {
  initialize,
  fetchData,
  clearData,
  pollData,
  cancelPollData,
  deleteData,
  updateData
})(DetailView);
