import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Table from '../table/Table';
import Detail from '../detail/Detail';
import {fetchData, fetchChildrenData, clearData} from './DynamicActions';

export default function dynamicRoutes() {
  class DynamicRoute extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: false,
        activeSchema: null,
        childSchemas: []
      };
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.location.pathname !== nextProps.location.pathname) {

        this.props.clearData();
        const splitSplat = nextProps.params.splat.split('/');

        if (splitSplat.length % 2 === 0) {
          const activeSchema = this.props.schemaReducer.find(
            object => object.singular === splitSplat[splitSplat.length - 2]
          );
          const childSchemas = this.props.schemaReducer.filter(
            object => object.parent === activeSchema.id
          );

          this.props.fetchData(activeSchema.url + '/' + splitSplat[splitSplat.length - 1], activeSchema.singular);
          childSchemas.forEach(object => {
            this.props.fetchChildrenData(
              activeSchema.url + '/' + splitSplat[splitSplat.length - 1] + '/' + object.plural, object.plural);
          });
          this.setState({activeSchema, childSchemas, component: true});
        } else {
          const activeSchema = this.props.schemaReducer.find(
            object => object.plural === splitSplat[splitSplat.length - 1]
          );
          this.props.fetchData(activeSchema.url, activeSchema.plural);

          this.setState({activeSchema, component: true});
        }
      }
    }

    getComponent(splat) {
      const splitSplat = splat.split('/');

      if (splitSplat.length % 2 === 0) {
        return (
          <div>
            <Detail schema={this.state.activeSchema} {...this.props.dynamicReducer} />
            {this.state.childSchemas.map(
              (object, key) => <Table key={key} schema={object}
                data={this.props.dynamicReducer.children[object.plural]}
              />
            )}
          </div>
        );
      }
      return (
        <Table schema={this.state.activeSchema} {...this.props.dynamicReducer} />
      );
    }

    render() {
      if (this.state.component) {
        return (
          <div>
            {this.getComponent(this.props.params.splat)}
          </div>
        );
      }
      return (
        <div>Loading...</div>
      );
    }
  }

  DynamicRoute.contextTypes = {
    router: PropTypes.object
  };

  function mapStateToProps(state) {
    return {
      dynamicReducer: state.dynamicReducer,
      schemaReducer: state.schemaReducer
    };
  }

  return connect(mapStateToProps, {
    fetchData,
    fetchChildrenData,
    clearData
  })(DynamicRoute);
}
