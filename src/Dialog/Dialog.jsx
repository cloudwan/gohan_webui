import React, {Component} from 'react';
import {Dialog, Button, ProgressBar, Intent} from '@blueprintjs/core';
import {connect} from 'react-redux';
import Form from 'react-jsonschema-form';

import CustomSchemaField from './formComponents/CustomSchemaField/CustomSchemaField';
import {fetchRelationFields, clearData} from './DialogActions';

export class GeneratedDialog extends Component {
// class GeneratedDialog extends Component {
  componentDidMount() {
    this.props.fetchRelationFields(this.props.schema.schema, this.props.action);
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  handleSubmit = ({formData}) => {
    this.props.onSubmit(formData, this.props.data.id);
    this.props.onClose(); // Add check success
  };

  render() {
    const {action, schema} = this.props;
    const title = `${action[0].toUpperCase() + action.slice(1)} new ${schema.singular}`;

    const actions = [
      <Button key={0} text="Cancel"
        onClick={this.props.onClose}
      />,
      <Button key={1} text="Submit"
        intent={Intent.PRIMARY} onClick={event => {
          this.form.onSubmit(event);
        }}
      />
    ];
    return (
      <Dialog title={title} actions={actions}
        autoScrollBodyContent={true}
        {...this.props}>
        <div className="pt-dialog-body">
          {(() => {
            if (this.props.dialogReducer.isLoading) {
              return (
                <ProgressBar/>
              );
            }

            return (
              <div>
                <Form ref={c => {this.form = c;}} schema={this.props.dialogReducer.schema}
                  fields={{SchemaField: CustomSchemaField}} formData={
                    this.props.dialogReducer.schema.propertiesOrder.reduce(
                      (result, item) => {
                        result[item] = this.props.data[item];
                        return result;
                      }, {}
                    )}
                  uiSchema={{'ui:order': this.props.dialogReducer.schema.propertiesOrder}} onSubmit={this.handleSubmit}>
                  <div/>
                </Form>
              </div>
            );
          })()}
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            {actions}
          </div>
        </div>
      </Dialog>
    );
  }
}

GeneratedDialog.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    dialogReducer: state.dialogReducer
  };
}
export default connect(mapStateToProps, {
  fetchRelationFields,
  clearData
})(GeneratedDialog);
