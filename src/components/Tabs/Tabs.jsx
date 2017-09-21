import React, {Component} from 'react';
import ProtoTypes from 'prop-types';

import styles from './styles.css';

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.selectedTabId !== this.state.activeTab) {
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
    children: ProtoTypes.node.isRequired,
  };
}
