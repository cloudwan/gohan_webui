/* global it, describe */
import chai from 'chai';
import * as actionTypes from './ConfigActionTypes';
import configReducer from './configReducer';

chai.should();

describe('configReducer ', () => {

  it('should return initial state', () => {
    configReducer(undefined, {}).should.deep.equal({});
  });

  it('should handle FETCH_SUCCESS', () => {
    configReducer(
      undefined, {
        type: actionTypes.FETCH_SUCCESS,
        data: {
          authUrl: 'http://localhost:9091/v2.0',
          gohan: {
            schema: '/gohan/v0.1/schemas',
            url: 'http://localhost:9091'
          }
        }
      }
    ).should.deep.equal({
      authUrl: 'http://localhost:9091/v2.0',
      gohan: {
        schema: '/gohan/v0.1/schemas',
        url: 'http://localhost:9091'
      }
    });
  });
});
