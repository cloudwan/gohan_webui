import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Col} from 'react-flexbox-grid';

import UrlInput from './components/UrlInput';
import HttpMethodInput from './components/HttpMethodInput';
import BodyData from './components/BodyData';
import ApiRequestForm from './components/ApiRequestForm';
import SuccessToaster from '../components/SuccessToaster';
import Button from '../components/Button';

import {getApiResponse} from './ApiRequestSelectors';
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
      query: '',
    };
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
      baseUrl,
      queryList,
      httpMethods,
      apiResponse,
      clearData,
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
            />
            <SuccessToaster title='Success:'
              onDismiss={clearData}
              resultYAML={apiResponse}
            />
          </Col>
        </Row>
      </ApiRequestForm>
    );
  }
}

const mapStateToProps = state => ({
  apiResponse: getApiResponse(state),
});

export default connect(mapStateToProps, {
  clearData,
  fetch,
})(ApiRequest);

if (process.env.NODE_ENV !== 'production') {
  ApiRequest.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    queryList: PropTypes.array,
    httpMethods: PropTypes.array,
    apiResponse: PropTypes.string,
  };
}
