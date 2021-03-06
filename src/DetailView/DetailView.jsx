import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';

import {getCollectionUrl} from './../schema/SchemaSelectors';

import {update as updateBreadcrumb} from './../breadcrumb/breadcrumbActions';

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
import {
  getSchema,
  getBreadcrumb,
  hasUpdatePermission,
  hasDeletePermission,
  getSingularActions,
} from './../schema/SchemaSelectors';
import {
  getGohanUrl,
  getFollowableRelationsState,
} from '../config/ConfigSelectors';
import {
  checkLoading,
  getData,
} from './DetailSelectors';
import {
  isAnyDialogOpen
} from '../Dialog/DialogSelectors';

import {getTenantId, isTenantFilterActive} from '../auth/AuthSelectors';

import {Alert, Intent} from '@blueprintjs/core';

export const getDetailView = (schema, DetailComponent = Detail, children = null) => {

  const schemaId = schema.id;

  class DetailView extends PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        alertOpen: false,
        dialogData: {}
      };
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props.isAnyDialogOpen && !nextProps.isAnyDialogOpen) {
        return true;
      } else if (this.props.isAnyDialogOpen) {
        return false;
      }

      return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
    }

    componentDidMount() {
      this.props.updateBreadcrumb(this.props.breadcrumb);
      this.props.fetch();
    }

    componentDidUpdate(prevProps) {
      if (
        prevProps.tenantId !== this.props.tenantId ||
        prevProps.tenantFilter !== this.props.tenantFilter
      ) {
        this.props.clearData();
        this.props.fetch();
      }
    }

    componentWillUnmount() {
      this.props.clearData();
      this.props.updateBreadcrumb();
    }

    handleOpenUpdateDialog = id => {
      this.setState({dialogData: id}, this.props.openUpdateDialog);
    };

    handleCloseUpdateDialog = () => {
      this.props.closeUpdateDialog();
    };

    handleSubmitUpdateDialog = data => {
      this.props.update(data);
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
        const {name, id} = this.props.data;

        return (
          <Alert intent={Intent.DANGER}
            isOpen={this.state.alertOpen}
            confirmButtonText='Delete'
            cancelButtonText='Cancel'
            onConfirm={this.handleDelete}
            onCancel={this.handleCloseAlert}>
            <p>Are you sure to delete <strong>{name || id}</strong>?</p>
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
        gohanUrl,
        className,
        followableRelations,
        actions,
      } = this.props;
      const UpdateDialog = dialog({name: `${schemaId}_update`})(
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
        <div>
          <div {...{className}}>
            <UpdateDialog/>
            {this.showAlert()}
            <DetailComponent {...this.props}
              actions={actions}
              schema={activeSchema}
              data={data}
              onEdit={this.handleOpenUpdateDialog}
              onDelete={this.handleOpenAlert}
              url={url}
              id={data.id}
              gohanUrl={gohanUrl}
              followableRelations={followableRelations}
            />
          </div>
          {children}
        </div>
      );
    }
  }

  DetailView.propTypes = {
    clearData: PropTypes.func.isRequired,
    updatePermission: PropTypes.bool.isRequired,
    deletePermission: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  };

  function mapStateToProps(state, {match}) {
    return {
      url: getCollectionUrl(state, schemaId, match.params),
      breadcrumb: getBreadcrumb(state, schemaId, match.params),
      activeSchema: getSchema(state, schemaId),
      uiSchema: getUiSchema(state, schemaId),
      isLoading: checkLoading(state),
      data: getData(state, schemaId),
      gohanUrl: getGohanUrl(state),
      followableRelations: getFollowableRelationsState(state),
      updatePermission: hasUpdatePermission(state, schemaId),
      deletePermission: hasDeletePermission(state, schemaId),
      isAnyDialogOpen: isAnyDialogOpen(state, [
        `${schemaId}_update`
      ]),
      actions: getSingularActions(state, schemaId),
      tenantId: getTenantId(state),
      tenantFilter: isTenantFilterActive(state),
    };
  }

  const mapDispatchToProps = (dispatch, {match}) => {
    return bindActionCreators({
      openUpdateDialog: openDialog(`${schemaId}_update`),
      closeUpdateDialog: closeDialog(`${schemaId}_update`),
      fetch: fetch(schema.id, match.params),
      clearData,
      remove: remove(schema.id, match.params),
      update: update(schema.id, match.params),
      updateBreadcrumb
    }, dispatch);
  };

  return connect(mapStateToProps, mapDispatchToProps)(DetailView);
};
