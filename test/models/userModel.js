/* global describe, it, beforeEach */
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';

chai.should();
chai.use(sinonChai);

const sync = sinon.spy();
const save = sinon.spy();
const ajax = sinon.spy((...params) => console.log(...params));

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
  },
  ajax(options){
    if (this._saveState) {
      setTimeout(() => {
        options.success(this._data)
      }, 0);
    } else {
      setTimeout(options.error, 0);
    }
    ajax(options);
  }
};

const UserModel = proxyquire('./../../app/js/models/userModel', {
  backbone,
}).default;

describe('UserModel ', () => {
  describe('#defaults()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({
        url: 'http://foo.bar',
        config: {
          get: () => undefined
        }
      });
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
        new UserModel({url: 'http://foo.bar/', config: {
          get: () => undefined
        }});
      }).to.not.throw(Error);
    });
  });

  describe('#parse()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar', config: {
        get: () => undefined
      }});
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
      user.authData.should.be.deep.equal(testData);
    });
  });

  describe('#sync()', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar', config: {
        get: () => undefined
      }});
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

  describe('#login', () => {
    let user = {};
    beforeEach(() => {
      sessionStorage.clear();
      user = new UserModel({url: 'http://foo.bar', config: {get: () => 30000}});
      ajax.reset();
    });

    it('calls login with parameters.', () => {
      backbone._data = {
        access: {
          token: {
            id: "token"
          }
        }
      }
      backbone._saveState = true;
      user.login("id", "password").then((aa) => {console.log(aa)
        user.unscopedToken().should.be.equal("token");
        done()
      });
      ajax.should.be.calledWith(sinon.match({
        timeout: 30000,
        data: '{"auth":{"passwordCredentials":{"username":"id","password":"password"}}}',
        dataType: "json",
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        url: "http://foo.bar/tokens"
      }))
    });

    it('calls login with parameters then fail', () => {
      backbone._saveState = false;
      user.login("id", "password").catch(() => done());
    });

    it('fetch tenant success', () => {
      backbone._saveState = true;
      backbone._data = {
        tenants: []
      }
      user.fetchTenant(() => done(), null);
      ajax.should.be.calledWith(sinon.match({
        dataType: "json",
        headers: { 'Content-Type': 'application/json' },
        method: "GET",
        url: "http://foo.bar/tenants"
      }))
    });

    it('fetch tenant failed', () => {
      backbone._saveState = false;
      user.fetchTenant(null, () => done());
    });

    it('skip login if we have tenant list', () => {
      user.saveTenants([{name: "admin"}, {name: "demo"}]);
      user.login("id", "password");
      ajax.called.should.be.equal(false);
    });
  });

  describe('#loginTenant', () => {
    let user = {};

    beforeEach(() => {
      sessionStorage.clear();
      user = new UserModel({url: 'http://foo.bar', config: {
        get: () => undefined
      }});
    });

    it('calls loginTenant with parameters.', () => {
      user._saveState = true;
      user.loginTenant("admin").then(() => done());
      const authData = {
        auth: {
          token: {
            id: undefined,
          },
          tenantName: "admin"
        }
      };
      save.should.be.calledWith(authData, sinon.match({
        data: '{"auth":{"token":{},"tenantName":"admin"}}',
      }))
    });

    it('calls loginTenant with parameters and fail', () => {
      user._saveState = false;
      user.loginTenant("admin").catch(() => done());
    });
  });

  describe('#setItem and getItem', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar', config: {
        get: () => undefined
      }});
    });

    it('calls setItem and getItem', () => {
      user.loginTenant("admin");
      const value = {key: "value"};
      user.setItem("testkey", value);
      const actual = user.getItem("testkey");
      actual.should.be.deep.equal(value);
    });
  });

  describe('#token management', () => {
    let user = {};

    beforeEach(() => {
      user = new UserModel({url: 'http://foo.bar', config: {
        get: () => undefined
      }});
      user.saveUnscopedToken({
        access: {
          user: {
            name: "user"
          },
          token: {
            id: "token"
          }
        }
      });
      user.saveTenant("admin");
      user.saveScopedToken({
        access: {
          user: {
            name: "user"
          },
          token: {
            id: "token"
          }
        }
      });
      user.saveTenants([{name: "admin"}, {name: "demo"}]);
    });

    it('calls userName', () => {
        user.userName().should.be.equal("user");
    });

    it('calls authToken', () => {
        user.authToken().should.be.equal("token");
    });

    it('calls unsetAuthData', () => {
        user.unsetAuthData();
        if(user.authToken()){
            sinon.assert.fail("should be undefined")
        }
        if(user.tenantName()){
            sinon.assert.fail("should be undefined")
        }
        if(user.tenants()){
            sinon.assert.fail("should be undefined")
        }
        if(user.unscopedToken()){
            sinon.assert.fail("should be undefined")
        }
    });
  });


});
