import {ajax} from 'rxjs/observable/dom/ajax';
import {stringify as queryStringify} from 'query-string';

export const getSingular = (url, headers) => ajax({method: 'GET', url, headers, crossDomain: true});

export const get = (...params) => { // backward compatibility
  console.warn('[Gohan API] get method was deprecated please use getSingular or getCollection method.');
  return getSingular(...params);
};

export const getCollection = (url, headers, query: {}) => ajax({
  method: 'GET',
  url: `${url}?${queryStringify({limit: 10, ...query})}`,
  headers,
  crossDomain: true
});

export const post = (url, headers, body) => ajax({method: 'POST', url, body, headers, crossDomain: true});

export const put = (url, headers, body) => ajax({method: 'PUT', url, body, headers, crossDomain: true});

export const purge = (url, headers) => ajax({method: 'DELETE', url, headers, crossDomain: true});

export const parseXHRError = error => {
  if (error) {
    if (error.xhr) {
      if (error.xhr.response) {
        const {response} = error.xhr;

        if (typeof response === 'object') {
          if (response.error) {
            const {error} = response;

            if (typeof error === 'object') {
              if (error.message) {
                if (typeof error.message === 'string') {
                  return error.message;
                }
              }
            } else if (typeof error === 'string') {
              return error;
            }
          }
        } else if (typeof response === 'string') {
          return response;
        }
      }
    } else if (error.message) {
      return error.message;
    }
  }
  return 'Unknown error!';
};
