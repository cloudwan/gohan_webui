import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faTerminal} from '@fortawesome/fontawesome-free-solid';

import {Menu, MenuItem, Button} from '@blueprintjs/core';
import {Popover2} from '@blueprintjs/labs';

import dialog from '../Dialog';
import Dialog from '../Dialog/Dialog';
import Confirm from '../Dialog/Confirm';

import {execute} from './CustomActionsActions';

import {openDialog, closeDialog} from '../Dialog/DialogActions';

export class CustomActions extends Component {
  handleActionClick = name => {
    this.props.customActions[name].openDialog();
  };

  handleCustomActionSubmit = (name, data) => {
    const {
      baseUrl,
      id,
      actions,
    } = this.props;

    this.props.execute(actions[name], baseUrl, id, data);
  };

  handleCustomActionConfirm = name => {
    const {
      baseUrl,
      id,
      actions,
    } = this.props;

    let responseType;

    if (actions[name].output && actions[name].output.format === 'html') {
      responseType = 'text';
    }

    this.props.customActions[name].closeDialog();
    this.props.execute(actions[name], baseUrl, id, undefined, responseType);
  };

  render() {
    const {
      actions,
    } = this.props;
    const actionsKeys = Object.keys(actions);
    const actionsDialogs = actionsKeys.map(key => {
      if (actions[key].input === null) {
        const ActionConfirm = dialog({name: key})(
          props => (
            <Confirm {...props}
              title={`Custom Action ${key.replace(/_/g, ' ').trim()}`}
              text={`Are you sure to perform "${key.replace(/_/g, ' ').trim()}" custom action?`}
              onClose={this.props.customActions[key].closeDialog}
              onSubmit={() => this.handleCustomActionConfirm(key)}
            />
          )
        );
        return (
          <ActionConfirm key={key}/>
        );
      }

      const ActionDialog = dialog({name: key})(
        props => (
          <Dialog {...props}
            customTitle={`Custom action: ${key.replace(/_/g, ' ').trim()}`}
            customButtonLabel={'Submit'}
            onClose={this.props.customActions[key].closeDialog}
            onSubmit={data => this.handleCustomActionSubmit(key, data)}
            data={{}}
            baseSchema={{schema: actions[key].input}}
          />
        )
      );
      return (
        <ActionDialog key={key}/>
      );
    });

    return (
      <div>
        <Popover2 content={
          <Menu>
            {actionsKeys.map(key => (
              <MenuItem key={key}
                className="detail-custom-action"
                text={actions[key].title || key.replace(/_/g, ' ').trim()}
                onClick={() => this.handleActionClick(key)}
              />
            ))}
          </Menu>
        }
          placement="bottom-end"
          minimal={true}>
          <Button className={'pt-minimal pt-intent-primary custom-actions'}
            rightIconName="caret-down">
            <FontAwesomeIcon className="faicon" icon={faTerminal} />Custom Actions
          </Button>
        </Popover2>
        {actionsDialogs}
      </div>
    );
  }
}

CustomActions.propTypes = {
  actions: PropTypes.object.isRequired
};

const mapDispatchToProps = (dispatch, props) => {
  const actions = bindActionCreators({
    execute,
  }, dispatch);

  if (props.actions !== undefined) {
    const actionsKeys = Object.keys(props.actions);
    actions.customActions = actionsKeys.reduce((result, key) => {
      result[key] = bindActionCreators({
        openDialog: openDialog(key),
        closeDialog: closeDialog(key)
      }, dispatch);

      return result;
    }, {});
  }

  return actions;
};

export default connect(null, mapDispatchToProps)(CustomActions);
