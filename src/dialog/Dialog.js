import React, {Component} from 'react';
import {Dialog, RefreshIndicator, FlatButton} from 'material-ui';
import {connect} from 'react-redux';
import Form from 'react-jsonschema-form';
import CustomSchemaField from './formComponents/CustomSchemaField/CustomSchemaField';
import {fetchRelationFields, clearData} from './DialogActions';

const loadingIndicatorStyle = {
  margin: 'auto',
  position: 'relative'
};

class GeneratedDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      if (nextProps.open) {
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
    const {action, schema} = this.props;
    const title = `${action[0].toUpperCase() + action.slice(1)} new ${schema.singular}`;

    const actions = [
      <FlatButton key={0} label="Cancel"
        primary={true} onTouchTap={this.props.onRequestClose}
      />,
      <FlatButton key={1} label="Submit"
        primary={true} onTouchTap={event => {
          this.form.onSubmit(event);
        }}
      />,
    ];

    return (
      <Dialog title={title} actions={actions}
        autoScrollBodyContent={true}
        {...this.props}>
        {(() => {
          if (this.props.dialogReducer.isLoading) {
            return (
              <RefreshIndicator size={60} left={0}
                top={0} status="loading"
                style={loadingIndicatorStyle}
              />
            );
          }

          return (
            <div>
              <Form ref={c => {this.form = c;}} schema={this.props.dialogReducer.schema}
                fields={{SchemaField: CustomSchemaField}}
                uiSchema={{'ui:order': this.props.dialogReducer.schema.propertiesOrder}} onSubmit={this.handleSubmit}>
                <div/>
              </Form>
            </div>
          );
        })()}
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
