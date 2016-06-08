import React from 'react';

import jsyaml from 'js-yaml';

import {
  OverlayTrigger,
  Button,
  Popover
} from 'react-bootstrap';

import EditButton from './editButton.jsx';

export default class TableRow extends React.Component {
  constructor(params) {
    super(params);
  }

  render() {
    const item = this.props.item;
    const list = this.props.schema.schema.propertiesOrder.map((key, index) => {
      const property = this.props.schema.schema.properties[key];
      const view = property['view'];
      const keyValue = String(this.props.index) + index;

      if (view && !view.includes('list')) {
        return;
      }
      const title = property.title.toLowerCase();

      const urlPattern = /^((http|https):\/\/)/;

      try {
        if (property.type === 'object' || property.originalType === 'object') {
          if (item[key] === undefined) {
            return;
          }
          const content = <pre>{jsyaml.safeDump(item[key])}</pre>;
          return <td key = {keyValue}>
            <OverlayTrigger trigger = 'click'
              placement = 'left'
              toggle = 'hover'
              overlay = {<Popover id = '1'>{content}</Popover>}>
              <Button bsSize = 'small' bsStyle = 'default'>View</Button>
            </OverlayTrigger>
          </td>;
        }
      } catch (error) {
        console.error(error);
      }

      try {
        if (property.type === 'array') {
          if (item[key] === undefined) {
            return;
          }
          return (
            <td key = {keyValue}>
              <pre>{jsyaml.safeDump(item[key])}</pre>
            </td>
          );
        }
      } catch (error) {
        console.error(error);
      }

      if (property['format'] === 'uri' && urlPattern.test(item[key])) {
        return (
          <td key = {keyValue}><a href = {item[key]}></a></td>
        );
      }

      if (title === 'name' || title === 'title') {
        const displayValue = item.name || item.title;
        return (
          <td key = {keyValue}>
            <a data-id = {item.name}
              href = {'#' + this.props.schema.url + '/' + item.id}>{displayValue}
            </a>
          </td>
        );
      }

      item[key] = item[key] !== undefined && item[key].toString();
      return (
        <td key = {keyValue}>{item[key]}</td>
      );
    });

    return (
      <tr>
        {list}
        <EditButton id = {item.id}
          editModel = {this.props.editModel.bind(this)}
          deleteModel = {this.props.deleteModel.bind(this)}
        />
      </tr>
    );
  }
}
