var JsonResponse, ObjectAbstract,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ObjectAbstract = require('./ObjectAbstract');

JsonResponse = (function(_super) {

  __extends(JsonResponse, _super);

  function JsonResponse(response, id, data) {
    this.id = id;
    this.response = response;
    if (data === void 0) {
      this.data = {};
    } else {
      this.data = data;
    }
  }

  JsonResponse.prototype.has = function(key) {
    return typeof this.data[key] !== 'undefined';
  };

  JsonResponse.prototype.get = function(key) {
    return this.data[key];
  };

  JsonResponse.prototype.set = function(key, value) {
    return this.data[key] = value;
  };

  JsonResponse.prototype.send = function() {
    return this.response.end(JSON.stringify({
      result: this.data,
      error: null,
      id: this.id
    }));
  };

  return JsonResponse;

})(ObjectAbstract);

module.exports = JsonResponse;
