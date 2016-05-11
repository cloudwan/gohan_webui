/* global describe, it, beforeEach */
import proxyquire from 'proxyquire';
import chai from 'chai';

const ConfigModel = proxyquire('./../../app/js/models/configModel', {
  backbone: {
    Model: class {
      fetch(options) {
        // Simulate error on fetch.
        if (this._fetchState) {
          setTimeout(options.success, 0);
        } else {
          setTimeout(options.error, 0);
        }
      }
    }
  }
}).default;

chai.should();

describe('ConfigModel ', () => {

  describe('#constructor()', () => {
    it('requires options with url argument', () => {
      chai.expect(() => {
        new ConfigModel();
      }).to.throw(Error);
      chai.expect(() => {
        new ConfigModel({url: 'http://foo.bar/'});
      }).to.not.throw(Error);
    });
  });

  describe('#parse()', () => {
    let config;

    beforeEach(() => {
      config = new ConfigModel({url: 'http://foo.bar'});
    });

    it('returns parsed data', () => {
      global.location = {hostname: 'localhost'};
      const testData1 = {
        authUrl: 'http://__HOST__:9091/v2.0',
        gohan: {
          schema: '/gohan/v0.1/schemas',
          url: 'http://__HOST__:9091'
        }
      };
      const resultData1 = {
        authUrl: 'http://localhost:9091/v2.0',
        gohan: {
          schema: '/gohan/v0.1/schemas',
          url: 'http://localhost:9091'
        }
      };
      const testData2 = {
        authUrl: 'http://foo.bar:9091/v2.0',
        gohan: {
          schema: '/gohan/v0.1/schemas',
          url: 'http://__HOST__:9091'
        }
      };
      const resultData2 = {
        authUrl: 'http://foo.bar:9091/v2.0',
        gohan: {
          schema: '/gohan/v0.1/schemas',
          url: 'http://localhost:9091'
        }
      };
      const testData3 = {
        authUrl: 'http://__HOST__:9091/v2.0',
        gohan: {
          schema: '/gohan/v0.1/schemas',
          url: 'http://foo.bar:9091'
        }
      };
      const resultData3 = {
        authUrl: 'http://localhost:9091/v2.0',
        gohan: {
          schema: '/gohan/v0.1/schemas',
          url: 'http://foo.bar:9091'
        }
      };

      config.parse(testData1).should.be.deep.equal(resultData1);
      config.parse(testData2).should.be.deep.equal(resultData2);
      config.parse(testData3).should.be.deep.equal(resultData3);
    });
  });

  describe('#fetch()', () => {
    let config = {};

    beforeEach(() => {
      config = new ConfigModel({url: 'http://foo.bar'});
    });

    it('returns promise', () => {
      config.fetch().should.be.a('promise');
    });

    it('calls success callback', done => {
      config._fetchState = true;  // Simulate error on fetch.
      config.fetch().then(() => {
        done();
      });
    });

    it('calls error callback', done => {
      config._fetchState = false; // Simulate error on fetch.
      config.fetch().catch(() => {
        done();
      });
    });
  });
});
