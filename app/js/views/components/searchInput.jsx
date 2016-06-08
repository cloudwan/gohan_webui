import React from 'react';

export default class SearchInput extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      sortKey: ''
    };

    this.searchDelay = this.props.delay;
    this.searchTimeout = undefined;
  }

  selectFieldChange(event) {
    const newQuery = {
      propField: event.target.value
    };

    this.props.changeCallback.call(this, newQuery);
  }

  searchFieldChange(event) {
    const newQuery = {
      sortKey: event.target.value,
    };
    this.setState({
      sortKey: event.target.value
    });
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(this.props.changeCallback.bind(this, newQuery), this.searchDelay);
  }

  render() {
    let list = this.props.schema.schema.propertiesOrder.map((key, index) => {
      const property = this.props.schema.schema.properties[key];
      const view = property['view'];

      if (view && !view.includes('list')) {
        return null;
      }

      return (
        <option key = {'option' + index} value = {key}>{property.title}</option>
      );
    });

    return (
      <span>
        <select className = 'form-control search'
          onChange = {this.selectFieldChange.bind(this)} >
          {list}
        </select>
        <input type = 'text'
          className = 'form-control search'
          placeholder = 'Search'
          onChange = {this.searchFieldChange.bind(this)}
          value = {this.state.sortKey}
        />
      </span>
    );
  }
}

SearchInput.PropDefaults = {
  delay: 500
};

SearchInput.PropTypes = {
  delay: React.PropTypes.number
};
