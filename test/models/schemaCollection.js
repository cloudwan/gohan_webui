/* global describe, it, beforeEach */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';

chai.should();
chai.use(sinonChai);

const sync = sinon.spy();
const SchemaCollection = proxyquire('./../../app/js/models/schemaCollection', {
  backbone: {
    Collection: class {
      fetch(options) {
        if (this._fetchState) {
          setTimeout(options.success, 0);
        } else {
          setTimeout(options.error, 0);
        }
      }
      sync(...params) {
        sync(...params);
      }
    }
  },
  './schemaModel': {
    default: class {}
  }
}).default;

describe('SchemaCollection ', () => {
  describe('#constructor()', () => {
    it('requires options with url argument', () => {
      chai.expect(() => {
        new SchemaCollection();
      }).to.throw(Error);
      chai.expect(() => {
        new SchemaCollection({url: 'http://foo.bar/'});
      }).to.not.throw(Error);
    });
  });

  describe('#parse()', () => {
    let schemaCollection;

    beforeEach(() => {
      schemaCollection = new SchemaCollection({url: 'http://foo.bar/'});
    });

    it('returns schema from response.', () => {
      schemaCollection.parse({schemas: 'testResponse'}).should.be.equal('testResponse');
    });
  });

  describe('#unsetAuthData()', () => {
    let schemaCollection;
    let unsetAuthData = sinon.spy();

    beforeEach(() => {
      schemaCollection = new SchemaCollection({
        url: 'http://foo.bar/',
        userModel: {
          unsetAuthData
        }
      });
    });

    it('should call ussetAuthData.', () => {
      schemaCollection.unsetAuthData();
      unsetAuthData.should.be.calledOnce;
    });
  });

  describe('#fetch()', () => {
    let schemaCollection;

    beforeEach(() => {
      schemaCollection = new SchemaCollection({
        url: 'http://foo.bar/'
      });
    });

    it('should resolves promise.', done => {
      schemaCollection._fetchState = true;
      schemaCollection.fetch().then(() => {
        done();
      });
    });

    it('should reject promise.', done => {
      schemaCollection._fetchState = false;
      schemaCollection.fetch().catch(() => {
        done();
      });
    });
  });

  describe('#sync()', () => {
    let schemaCollection;

    beforeEach(() => {
      schemaCollection = new SchemaCollection({
        url: 'http://foo.bar/',
        userModel: {
          authToken() {
            return 'token';
          }
        }
      });
    });

    it('calls super sync() method with parameters.', () => {
      schemaCollection.sync('update', {}, {});
      sync.should.be.calledWith('update', {}, {
        headers: {
          'X-Auth-Token': 'token',
          'Content-Type': 'application/json'
        }
      });
    });

    it('calls super sync() method without options parameter.', () => {
      schemaCollection.sync('update', {user: 'test'});
      sync.should.be.calledWith('update', {user: 'test'}, {
        headers: {
          'X-Auth-Token': 'token',
          'Content-Type': 'application/json'
        }
      });
    });
  });
});
