/* global describe, it, beforeEach */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';

chai.should();
chai.use(sinonChai);

const sync = sinon.spy();
const save = sinon.spy();

const backbone = {
  Model: class {
    set(key, value) {
      this[key] = value;
    }
    sync(...params) {
      sync(...params);
    }
    save(data, options) {
      if (this._saveState) {
        setTimeout(options.success, 0);
      } else {
        setTimeout(options.error, 0);
      }
      save(data, options);
    }
  }
};
const cookie = {
  remove: sinon.spy(key => {
    delete cookie.data[key];
  }),
  set: sinon.spy((key, value) => {
    cookie.data[key] = value;
  }),
  get: sinon.spy(key => cookie.data[key]),
  data: {}
};

const UserModel = proxyquire('./../../app/js/models/userModel', {
  backbone,
  'js-cookie': cookie
}).default;


describe('UserModel ', () => {
  describe('#defaults()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar'});
      cookie.data = {};
    });

    it('returns defaults values', () => {
      user.defaults().should.be.deep.equal({authData: undefined});
    });
  });

  describe('#constructor()', () => {
    it('requires options with url argument', () => {
      chai.expect(() => {
        new UserModel();
      }).to.throw(Error);
      chai.expect(() => {
        new UserModel({url: 'http://foo.bar/'});
      }).to.not.throw(Error);
    });
  });

  describe('#parse()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar'});
      cookie.data = {};
    });

    it('sets auth data.', () => {
      const testData = {
        access: {
          token: {
            id: 'test1',
            tenant: {
              name: 'testTenantName'
            }
          },
          user: {
            name: 'testName'
          }
        }
      };

      user.parse(testData);
      cookie.data.tenantName.should.be.equal('testTenantName');
      cookie.data.userName.should.be.equal('testName');
      cookie.data.authData1.should.be.equal('test1');
      cookie.data.authData2.should.be.equal('');
      user.authData.should.be.deep.equal(testData);
    });
  });

  describe('#sync()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar'});
      cookie.data = {};
    });

    it('calls super sync() method with parameters.', () => {
      user.sync('update', {user: 'test'}, {});
      sync.should.be.calledWith('update', {user: 'test'}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    it('calls super sync() method without options parameter.', () => {
      user.sync('update', {user: 'test'});
      sync.should.be.calledWith('update', {user: 'test'}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
  });

  describe('#saveAuth()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar'});
      cookie.data = {};
    });

    it('calls super save() method with parameters.', () => {
      user.saveAuth('admin', 'pass', 'tenant');
      save.should.be.calledWith({
        auth: {
          passwordCredentials: {
            username: 'admin',
            password: 'pass'
          },
          tenantName: 'tenant'
        }
      });
    });

    it('calls success callback.', done => {
      user._saveState = true; // Simulate error on save.
      user.saveAuth('admin', 'pass', 'tenant').then(() => done());
    });

    it('calls error callback.', done => {
      user._saveState = false; // Simulate error on save.
      user.saveAuth('admin', 'pass', 'tenant').catch(() => done());
    });

  });

  describe('#setAuthData()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar'});
      cookie.data = {};
    });

    it('removes auth data calls without parameter.', () => {
      user.setAuthData();
      chai.expect(cookie.data.authData1).to.be.a('undefined');
      chai.expect(cookie.data.authData2).to.be.a('undefined');
    });

    it('sets auth data.', () => {
      const testData = {
        access: {
          token: {
            id: 'test1',
            tenant: {
              name: 'testTenantName'
            }
          },
          user: {
            name: 'testName'
          }
        }
      };

      user.setAuthData(testData);
      cookie.data.tenantName.should.be.equal('testTenantName');
      cookie.data.userName.should.be.equal('testName');
      cookie.data.authData1.should.be.equal('test1');
      cookie.data.authData2.should.be.equal('');
      user.authData.should.be.deep.equal(testData);
    });

    it('calls success callback.', done => {
      user._saveState = true; // Simulate error on save.
      user.saveAuth('admin', 'pass', 'tenant').then(() => done());
    });

    it('calls error callback.', done => {
      user._saveState = false; // Simulate error on save.
      user.saveAuth('admin', 'pass', 'tenant').catch(() => done());
    });
  });

  describe('#authToken()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar'});
      cookie.data = {};
    });

    it('returns empty tokent.', () => {
      delete cookie.data.authData1;
      cookie.data.authData2 = 'test';

      user.authToken().should.be.equal('');
    });

    it('returns empty tokent.', () => {
      cookie.data.authData1 = 'test';
      delete cookie.data.authData2;

      user.authToken().should.be.equal('');
    });

    it('returns tokent.', () => {
      cookie.data.authData1 = 'test';
      cookie.data.authData2 = 'token';

      user.authToken().should.be.equal('testtoken');
    });
  });

  describe('#tenantName()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar'});
      cookie.data = {};
    });

    it('returns tenant.', () => {
      cookie.data.tenantName = 'Test tenant';

      user.tenantName().should.be.equal('Test tenant');
    });
  });

  describe('#userName()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar'});
      cookie.data = {};
    });

    it('returns userName.', () => {
      cookie.data.userName = 'Test user name';

      user.userName().should.be.equal('Test user name');
    });
  });

  describe('#unsetAuthData()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar'});
      cookie.data = {};
    });

    it('unsets auth data.', () => {
      cookie.data.authData1 = 'Test_auth_data1';
      cookie.data.authData2 = 'Test_auth_data2';

      user.unsetAuthData();
      chai.expect(cookie.data.authData1).to.be.a('undefined');
      chai.expect(cookie.data.authData2).to.be.a('undefined');
    });
  });
});
