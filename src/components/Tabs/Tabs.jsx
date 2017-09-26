import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

class Tabs extends Component {
  static defaultProps = {
    onChange: () => {},
  }

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

    return (
      <div>
        <div className={styles.tabsHeader}>
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
        <div className={styles.tabsContent}>
          {children.map((item, index) => (
            <div className={index === this.state.activeTab ? styles.tabPanelActive : styles.tabPanel}
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
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func,
  };
}
