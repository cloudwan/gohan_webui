import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Col} from 'react-flexbox-grid';
import {Inspector} from 'react-inspector';

import UrlInput from './components/UrlInput';
import HttpMethodInput from './components/HttpMethodInput';
import BodyData from './components/BodyData';
import ApiRequestForm from './components/ApiRequestForm';
import Button from '../components/Button';

import {
  getApiResponse,
  checkLoading
} from './apiRequestSelectors';
import {
  fetch,
  clearData,
} from './apiRequestActions';

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
    };
  }

  componentWillUnmount() {
    this.props.clearData();
  }

  handleQueryChange = event => this.setState({query: event.target.value})

  handleMethodChange = event => this.setState({method: event.target.value});

  handleBodyChange = code => this.setState({body: code});

  handleSubmit = () => {
    const {
      method,
      body,
      query,
    } = this.state;

    const {
      baseUrl,
      fetch,
    } = this.props;

    fetch(method, `${baseUrl}${query}`, body);
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
    } = this.state;

    return (
      <ApiRequestForm>
        <UrlInput baseUrl={baseUrl}
          queryList={queryList}
          onChange={this.handleQueryChange}
          query={query}
        />
        <HttpMethodInput methods={httpMethods}
          onChange={this.handleMethodChange}
          selectedMethod={method}
        />
        <BodyData code={body}
          onChange={this.handleBodyChange}
        />
        <Row start="xs">
          <Col xs={12}>
            <Button text="Submit"
              onClick={this.handleSubmit}
              loading={isLoading}
            />
          </Col>
        </Row>
        {apiResponse !== undefined && (
          <div className="request-form-section">
            <Row start="xs">
              <Col xs={12}>
                <div className="pt-card">
                  <Inspector data={apiResponse} />
                </div>
              </Col>
            </Row>
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
    apiResponse: PropTypes.object,
  };
}
