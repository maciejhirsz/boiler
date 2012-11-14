var ObjectAbstract, Router,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ObjectAbstract = require('./ObjectAbstract');

Router = (function(_super) {

  __extends(Router, _super);

  Router.prototype.options = {};

  Router.prototype.paths = {};

  function Router(options) {
    this.setOptions(options);
  }

  Router.prototype.set = function(path, contentType, callback) {
    return this.paths[path] = {
      contentType: contentType,
      callback: callback
    };
  };

  Router.prototype.route = function(pathString, req, res) {
    var path;
    if (this.paths[pathString] != null) {
      path = this.paths[pathString];
      res.writeHead(200, {
        'Content-Type': path.contentType
      });
      path.callback(req, res);
      return true;
    }
    return false;
  };

  return Router;

})(ObjectAbstract);

module.exports = Router;
