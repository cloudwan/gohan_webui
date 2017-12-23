import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Tabs extends Component {
  static defaultProps = {
    onChange: () => {},
    children: [],
    className: undefined,
    style: undefined
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0
    };
  }

  componentWillReceiveProps(newProps) {
    const {selectedTabId: tabId} = newProps;
    if ((tabId !== undefined) && (tabId !== this.state.activeTab)) {
      this.setState({activeTab: newProps.selectedTabId});
    }
  }

  handleOnTabClick = index => {
    this.setState({activeTab: index});
    this.props.onChange(index);
  };

  render() {
    const {children} = this.props;

    if (children === false) {
      return null;
    }

    const {className, style} = this.props;

    return (
      <div {...{className, style}}>
        <div className="nav nav-tabs">
          {React.Children.map(children, (child, index) => (
            React.cloneElement(
              child,
              {
                isActive: index === this.state.activeTab,
                onClick: () => this.handleOnTabClick(index)
              }
            )
          ))}
        </div>
        <div className="tab-content">
          {children.map((item, index) => (
            <div className={`tab-pane fade ${index === this.state.activeTab ? 'show active' : ''}`}
              key={index}>
              {item.props.panel}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Tabs;

if (process.env.NODE_ENV !== 'production') {
  Tabs.propTypes = {
    children: PropTypes.node,
    onChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.string
  };
}
