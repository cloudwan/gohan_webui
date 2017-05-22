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
  deleteData,
  updateData
} from './DetailActions';
import {getUiSchema} from './../uiSchema/UiSchemaSelectors';
import {Alert, Intent} from '@blueprintjs/core';

export const getDetailView = (DetailComponent = Detail) => {
  class DetailView extends Component {
    constructor(props) {
      super(props);

      const activeSchema = props.schemaReducer.data.find(
        object => object.singular === this.props.singular
      );
      const childSchemas = props.schemaReducer.data.filter(
        object => object.parent === activeSchema.id
      );
      const detail = props.params.id;
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

    componentWillUnmount() {
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
            onSubmit={this.handleSubmit} uiSchema={this.props.uiSchema.properties}
            baseSchema={this.state.activeSchema}
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
          <DetailComponent schema={this.state.activeSchema} data={data}
            onEdit={this.handleEdit} onDelete={this.handleOpenAlert}
          />
        </div>
      );
    }
  }

  DetailView.propTypes = {
    schemaReducer: PropTypes.object.isRequired,
    detailReducer: PropTypes.object.isRequired,
    configReducer: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    clearData: PropTypes.func.isRequired,
  };

  function mapStateToProps(state, props) {
    return {
      schemaReducer: state.schemaReducer,
      uiSchema: getUiSchema(state, props.singular),
      detailReducer: state.detailReducer,
      configReducer: state.configReducer
    };
  }


  return connect(mapStateToProps, {
    initialize,
    fetchData,
    clearData,
    deleteData,
    updateData
  })(DetailView);
};

export default getDetailView();
