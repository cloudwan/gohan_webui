import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      by: props.by || (props.properties.length > 0 && (props.properties[0].propKey || props.properties[0].id)) || '',
      value: props.value || ''
    };
  }

  filterTimeoutId = null;

  handleFilterKeyChange = () => {
    this.setState({by: this.select.value}, () => {
      if (this.state.value) {
        this.handleFilterData();
      }
    });
  };

  handleFilterValueChange = () => {
    clearTimeout(this.filterTimeoutId);

    this.setState({value: this.input.value}, () => {
      this.filterTimeoutId = setTimeout(() => {
        this.handleFilterData();
      }, 500);
    });
  };

  handleFilterData = () => {
    const {by, value} = this.state;

    if (value === undefined || value === '') {
      this.props.onChange(undefined);
      return;
    }

    this.props.onChange({[by]: value});
  };

  render() {
    const {properties} = this.props;

    return (
      <div>
        <select className="form-control mr-sm-1" value={this.state.by}
          ref={select => {this.select = select;}}
          onChange={this.handleFilterKeyChange}>
          {properties && properties.length > 0 && (
            properties.map((item, index) => {
              return (
                <option key={index} value={item.propKey || item.id}>{item.title}</option>
              );
            })
          )}
        </select>
        <input type="text"
          className="form-control mr-sm-1"
          placeholder="Search"
          ref={input => {this.input = input;}}
          value={this.state.value}
          onChange={this.handleFilterValueChange}
        />
      </div>
    );
  }
}

Filter.propTypes = {
  by: PropTypes.string,
  value: PropTypes.string,
  properties: PropTypes.array,
  onChange: PropTypes.func
};

export default Filter;
