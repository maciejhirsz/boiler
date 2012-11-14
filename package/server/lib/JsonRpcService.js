var JsonResponse, JsonRpcService, ObjectAbstract,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ObjectAbstract = require('./ObjectAbstract');

JsonResponse = require('./JsonResponse');

JsonRpcService = (function(_super) {

  __extends(JsonRpcService, _super);

  JsonRpcService.prototype.options = {
    path: '/json-rpc',
    router: null,
    api: null,
    session: true
  };

  JsonRpcService.prototype.sessionIdCharacters = 'qwertyuiopasdfghjklzxcvbnm0123456789';

  JsonRpcService.prototype.sessions = {};

  function JsonRpcService(options) {
    var _this = this;
    this.setOptions(options);
    if (!(this.options.router != null)) {
      throw "JsonRpcService requires options.router";
    }
    if (!(this.options.api != null)) {
      throw "JsonRpcService requires options.api";
    }
    this.options.router.set(this.options.path, 'application/json', function(req, res) {
      var apiNode, attr, input, params, response, session, _i, _len, _ref;
      try {
        input = JSON.parse(req.postString);
      } catch (err) {
        console.error("HTTP >> Badly formatted JSON-RPC input");
        res.end("null");
        return;
      }
      if (typeof input.method !== 'string') {
        throw "Missing method from user agent";
      }
      apiNode = _this.options.api;
      _ref = input.method.split('.');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        if (typeof apiNode[attr] === 'undefined') {
          return console.log("Invalid api call");
        }
        apiNode = apiNode[attr];
      }
      if (typeof apiNode !== 'function') {
        return console.log("Invalid api call");
      }
      response = new JsonResponse(res, input.id);
      params = input.params[0];
      session = _this.getSession(params, response);
      return apiNode(response, params, session);
    });
  }

  JsonRpcService.prototype.generateSessionId = function() {
    var characters, i, sessionId, _i;
    sessionId = '';
    characters = this.sessionIdCharacters.length;
    for (i = _i = 0; _i <= 29; i = ++_i) {
      sessionId += this.sessionIdCharacters[Math.floor(Math.random() * characters)];
    }
    return sessionId;
  };

  JsonRpcService.prototype.createSession = function(id) {
    return this.sessions[id] = {};
  };

  JsonRpcService.prototype.getSession = function(params, response) {
    var session, sessionId;
    if (typeof params.__sessionId === 'string' && params.__sessionId.length === 30 && this.sessions[params.__sessionId] !== void 0) {
      sessionId = params.__sessionId;
      session = this.sessions[sessionId];
    } else {
      sessionId = this.generateSessionId();
      session = this.createSession(sessionId);
    }
    response.set('__sessionId', sessionId);
    return session;
  };

  return JsonRpcService;

})(ObjectAbstract);

module.exports = JsonRpcService;
