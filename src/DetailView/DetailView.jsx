import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';

import LoadingIndicator from '../components/LoadingIndicator';
import Detail from '../components/Detail';
import Dialog from '../Dialog/Dialog';
import {
  fetch,
  clearData,
  remove,
  update
} from './DetailActions';
import dialog from '../Dialog';

import {
  openDialog,
  closeDialog
} from '../Dialog/DialogActions';

import {getUiSchema} from './../uiSchema/UiSchemaSelectors';
import {getSchema} from './../schema/SchemaSelectors';
import {getGohanUrl} from '../config/ConfigSelectors';
import {
  checkLoading,
  getData,
} from './DetailSelectors';

import {Alert, Intent} from '@blueprintjs/core';

export const getDetailView = (DetailComponent = Detail) => {
  class DetailView extends PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        modalOpen: false,
        alertOpen: false,
        actionModal: 'update',
        dialogData: {}
      };
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
    }

    componentDidMount() {
      this.props.fetch();
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

      this.props.update(data, this.props.closeUpdateDialog);
    };

    handleDelete = () => {
      this.props.remove();
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
      const {isLoading} = this.props;

      if (isLoading) {
        return (
          <LoadingIndicator/>
        );
      }

      const {
        data,
        activeSchema,
        url,
        id,
        gohanUrl,
      } = this.props;
      const UpdateDialog = dialog({name: `${this.props.schemaId}_update`})(
        props => (
          <Dialog {...props}
            action={'update'}
            onClose={this.handleCloseUpdateDialog}
            onSubmit={this.handleSubmitUpdateDialog}
            data={this.state.dialogData}
            baseSchema={activeSchema}
          />
        )
      );

      return (
        <div className="detail-container">
          <UpdateDialog/>
          {this.showAlert()}
          <DetailComponent schema={activeSchema}
            data={data}
            onEdit={this.handleOpenUpdateDialog}
            onDelete={this.handleOpenAlert}
            url={url}
            id={id}
            gohanUrl={gohanUrl}
          />
        </div>
      );
    }
  }

  DetailView.propTypes = {
    clearData: PropTypes.func.isRequired,
  };

  function mapStateToProps(state, {schemaId}) {
    return {
      activeSchema: getSchema(state, schemaId),
      uiSchema: getUiSchema(state, schemaId),
      isLoading: checkLoading(state),
      data: getData(state),
      gohanUrl: getGohanUrl(state),
    };
  }

  const mapDispatchToProps = (dispatch, {schemaId, params, url}) => {
    return bindActionCreators({
      openUpdateDialog: openDialog(`${schemaId}_update`),
      closeUpdateDialog: closeDialog(`${schemaId}_update`),
      fetch: fetch(`${url}/${params.id}`),
      clearData,
      remove: remove(`${url}/${params.id}`),
      update: update(`${url}/${params.id}`)
    }, dispatch);
  };

  return connect(mapStateToProps, mapDispatchToProps)(DetailView);
};

export default getDetailView();
