import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Inspector} from 'react-inspector';

import BaseUrl from './components/BaseUrl';
import UrlInput from './components/UrlInput';
import HttpMethodInput from './components/HttpMethodInput';
import BodyData from './components/BodyData';
import ApiRequestForm from './components/ApiRequestForm';
import {Button, Intent} from '@blueprintjs/core';

import {
  getApiResponse,
  checkLoading
} from './ApiRequestSelectors';
import {
  fetch,
  clearData,
} from './ApiRequestActions';

export class ApiRequest extends Component {
  static defaultProps = {
    httpMethods: ['GET', 'POST', 'PUT'],
    apiResponse: undefined,
    queryList: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      method: 'GET',
      query: (props.queryList && props.queryList.length > 0) ? props.queryList[0] : '',
      additionalQuery: ''
    };
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  handleQueryChange = event => this.setState({query: event.target.value})

  handleAdditionalQueryChange = event => this.setState({additionalQuery: event.target.value})

  handleMethodChange = event => this.setState({method: event.target.value});

  handleBodyChange = code => this.setState({body: code});

  handleSubmit = () => {
    const {
      method,
      body,
      query,
      additionalQuery
    } = this.state;

    const {
      baseUrl,
      fetch,
    } = this.props;

    fetch(method, `${baseUrl}${query}${additionalQuery}`, body);
  }

  render() {
    const {
      isLoading,
      baseUrl,
      queryList,
      httpMethods,
      apiResponse,
    } = this.props;

    const {
      body,
      method,
      query,
      AdditionalQuery
    } = this.state;

    return (
      <ApiRequestForm>
        <BaseUrl baseUrl={baseUrl}
          queryList={queryList}
          onChange={this.handleQueryChange}
          query={query}
        />
        <UrlInput onChange={this.handleAdditionalQueryChange}
          AdditionalQuery={AdditionalQuery}
        />
        <HttpMethodInput methods={httpMethods}
          onChange={this.handleMethodChange}
          selectedMethod={method}
        />
        <BodyData code={body}
          onChange={this.handleBodyChange}
        />
        <div className="row form-group">
          <div className="col-sm-9 offset-sm-3">
            <Button text="Submit"
              onClick={this.handleSubmit}
              loading={isLoading}
              intent={Intent.PRIMARY}
            />
          </div>
        </div>
        {apiResponse !== undefined && (
          <div className="row form-group">
            <div className="col-sm-3 col-form-label text-sm-right">
              API Response
            </div>
            <div className="col-sm-9">
              <div className="api-esponse">
                <Inspector data={apiResponse} />
              </div>
            </div>
          </div>
        )}
      </ApiRequestForm>
    );
  }
}

const mapStateToProps = state => ({
  apiResponse: getApiResponse(state),
  isLoading: checkLoading(state)
});

export default connect(mapStateToProps, {
  clearData,
  fetch,
})(ApiRequest);

if (process.env.NODE_ENV !== 'production') {
  ApiRequest.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    queryList: PropTypes.array,
    httpMethods: PropTypes.array,
    apiResponse: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  };
}
