import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
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
import dialog from '../Dialog';

import {
  openDialog,
  closeDialog
} from '../Dialog/DialogActions';

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

    handleOpenUpdateDialog = id => {
      this.setState({dialogData: id}, this.props.openUpdateDialog);
    };

    handleCloseUpdateDialog = () => {
      this.props.closeUpdateDialog();
    };

    handleSubmitUpdateDialog = data => {

      this.props.updateData(data, this.props.closeUpdateDialog);
    };

    handleDelete = () => {
      this.props.deleteData();
      this.handleCloseAlert();
    };

    handleOpenAlert = () => {
      this.setState({alertOpen: true});
    };

    handleCloseAlert = () => {
      this.setState({alertOpen: false});
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

      const UpdateDialog = dialog({name: `${this.props.schemaId}_update`})(
        props => (
          <Dialog {...props}
            action={'update'}
            onClose={this.handleCloseUpdateDialog}
            onSubmit={this.handleSubmitUpdateDialog}
            data={this.state.dialogData}
            baseSchema={this.state.activeSchema}
          />
        )
      );

      return (
        <div className="detail-container">
          <UpdateDialog/>
          {this.showAlert()}
          <DetailComponent schema={this.state.activeSchema} data={data}
            onEdit={this.handleOpenUpdateDialog} onDelete={this.handleOpenAlert}
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

  function mapDispatchToProps(dispatch, {schemaId}) {
    return bindActionCreators({
      openUpdateDialog: openDialog(`${schemaId}_update`),
      closeUpdateDialog: closeDialog(`${schemaId}_update`),
      initialize,
      fetchData,
      clearData,
      deleteData,
      updateData
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(DetailView);
};

export default getDetailView();
