import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Table from '../table/Table';
import Detail from '../detail/Detail';

export default function dynamicRoutes() {
  class DynamicRoute extends Component {
    getComponent(splat) {
      const splitSplat = splat.split('/');

      if (splitSplat.length % 2 === 0) {
        const finedElement = this.props.schemaReducer.find(
          object => object.singular === splitSplat[splitSplat.length - 2]
        );

        return (
          <Detail key={finedElement.id} schema={finedElement}
            splat={splitSplat}
          />
        );
      }

      const finedElement = this.props.schemaReducer.find(object => object.plural === splitSplat[splitSplat.length - 1]);
      return (
        <Table key={finedElement.id} schema={finedElement}/>
      );
    }

    render() {
      return (
        <div>
          {this.getComponent(this.props.params.splat)}
        </div>
      );
    }
  }

  DynamicRoute.contextTypes = {
    router: PropTypes.object
  };

  function mapStateToProps(state) {
    return {
      schemaReducer: state.schemaReducer
    };
  }

  return connect(mapStateToProps, {})(DynamicRoute);
}
