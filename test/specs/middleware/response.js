/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var sinon = require('sinon');
var errors = require('../../../lib/errors');
var middleware = require('../../../middleware/response');
var res = null;
var next = null;

describe('response middleware', function () {
  beforeEach(function () {
    res = {
      end: sinon.spy(function () {
        return res;
      }),
      json: sinon.spy(function () {
        return res;
      }),
      status: sinon.spy(function () {
        return res;
      }),
      location: sinon.spy(function () {
        return res;
      })
    };
    next = sinon.spy();
    middleware({
      _startedAt: process.hrtime()
    }, res, next);
    expect(next).to.have.been.called;
  });
  describe('total response time duration', function () {
    it('should be present if request contains coresponding property', function () {
      expect(res._finishedAt).to.be.above(0);
    });
  });
  describe('ok method', function () {
    it('should be function', function () {
      expect(res.ok).to.be.a('function');
    });
    it('should end request as application/json with 200 status', function () {
      res.ok({
        test: 'Lorem ipsum'
      });
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        test: 'Lorem ipsum'
      });
    });
  });
  describe('created method', function () {
    it('should be a function', function () {
      expect(res.created).to.be.a('function');
    });
    it('should end request with 201 status and location header', function () {
      res.created('/resource');
      expect(res.status).to.have.been.calledWith(201);
      expect(res.location).to.have.been.calledWith('/resource');
      expect(res.end).to.have.been.called;
    });
  });
  describe('noContent method', function () {
    it('should be a function', function () {
      expect(res.noContent).to.be.a('function');
    });
    it('should end request with 204', function () {
      res.noContent();
      expect(res.status).to.have.been.calledWith(204);
      expect(res.end).to.have.been.called;
    });
  });
  describe('error method', function () {
    it('should return request error with provided numeric code', function () {
      res.error(404);
      expect(next).to.have.been.calledTwice;
      expect(next.secondCall).to.have.been.calledWithMatch(sinon.match.instanceOf(errors.RequestError));
      expect(next.secondCall.args[0]).to.have.property('status', 404);
    });
    it('should return request error with provided error name', function () {
      res.error('NotFound');
      expect(next).to.have.been.calledTwice;
      expect(next.secondCall).to.have.been.calledWithMatch(sinon.match.instanceOf(errors.RequestError));
      expect(next.secondCall.args[0]).to.have.property('status', 404);
    });
  });
});

