var ObjectAbstract, Session,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ObjectAbstract = require('./ObjectAbstract');

Session = (function(_super) {

  __extends(Session, _super);

  Session.prototype.id = null;

  function Session() {
    this.data = {};
  }

  Session.prototype.getId = function() {
    return this.id;
  };

  Session.prototype.set = function(key, value) {
    return this.data[key] = value;
  };

  Session.prototype.get = function(key) {
    return this.data[key];
  };

  return Session;

})(ObjectAbstract);
