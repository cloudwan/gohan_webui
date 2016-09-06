import React, {Component} from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import Form from 'react-jsonschema-form';

import {fetchRelationFields, clearData} from './DialogActions';

class Dialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      if (nextProps.isOpen) {
        this.props.fetchRelationFields(this.props.schema.schema, this.props.action);
      } else {
        this.props.clearData();
      }
    }
  }

  handleSubmit = ({formData}) => {
    this.props.onSubmit(formData);
    this.props.onRequestClose(); // Add check success
  };

  render() {
    return (
      <Modal {...this.props}>
        {(() => {
          if (this.props.dialogReducer.isLoading) {
            return (
              <div>Loading...</div>
            );
          }
          return (
            <div>
              <Form schema={this.props.dialogReducer.schema}
                uiSchema={{'ui:order': this.props.dialogReducer.schema.propertiesOrder}} onSubmit={this.handleSubmit}>
                <button type="submit">Submit</button>
                {this.props.children}
              </Form>
            </div>
          );
        })()}
      </Modal>
    );
  }
}

Dialog.contextTypes = {
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
})(Dialog);
