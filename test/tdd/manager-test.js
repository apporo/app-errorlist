'use strict';

var devebot = require('devebot');
var lodash = devebot.require('lodash');
var assert = require('liberica').assert;
var dtk = require('liberica').mockit;

describe('manager', function() {
  describe('newError()', function() {
    var loggingFactory = dtk.createLoggingFactoryMock({ captureMethodCall: false });
    var ctx = {
      L: loggingFactory.getLogger(),
      T: loggingFactory.getTracer(),
      packageName: 'app-errorlist',
    }

    var Manager, newError;

    beforeEach(function() {
      Manager = dtk.acquire('manager');
      newError = dtk.get(Manager, 'newError');
    });

    it('newError() must build the error with provided attributes correctly', function() {
      var err = newError('UserNotFound', 'username must be provided', {
        unknown: undefined,
        empty: null,
        returnCode: 1000,
        statusCode: 500,
        payload: {
          email: 'user@example.com',
          password: '********'
        }
      });
      assert.equal(err.name, 'UserNotFound');
      assert.equal(err.message, 'username must be provided');
      assert.equal(err.returnCode, 1000);
      assert.equal(err.statusCode, 500);
      assert.deepEqual(err.payload, {
        email: 'user@example.com',
        password: '********'
      });
      assert.isTrue('empty' in err);
      assert.isFalse('unknown' in err);
    });
  });

  describe('ErrorBuilder', function() {
    var loggingFactory = dtk.createLoggingFactoryMock({ captureMethodCall: false });
    var ctx = {
      L: loggingFactory.getLogger(),
      T: loggingFactory.getTracer(),
      packageName: 'app-errorlist',
    }

    var Manager, ErrorBuilder;

    beforeEach(function() {
      Manager = dtk.acquire('manager');
      ErrorBuilder = dtk.get(Manager, 'ErrorBuilder');
    });

    it('must embed [packageRef, returnCode] fields to the error object', function() {
      var builder = new ErrorBuilder({
        packageName: 'app-restfront',
        errorCodes: {
          UserNotFound: {
            message: 'User not found',
            returnCode: 1000,
            statusCode: 400
          },
          UserIsLocked: {
            message: 'User is locked',
            returnCode: 1001,
            statusCode: 400
          },
        }
      });

      var err = builder.newError('UserNotFound', {
        payload: {
          email: 'user@example.com',
          password: '********'
        }
      });

      assert.equal(err.name, 'UserNotFound');
      assert.equal(err.message, 'User not found');
      assert.equal(err.statusCode, 400);
      assert.equal(err.returnCode, 1000);
      assert.equal(err.packageRef, 'A6+4vsPnaKIsWdzGkPE1IyK4FmE=');
      assert.deepEqual(err.payload, {
        email: 'user@example.com',
        password: '********'
      });
    });
  });
});
