var ObjectAbstract,
  __slice = [].slice;

ObjectAbstract = (function() {

  function ObjectAbstract() {}

  ObjectAbstract.prototype.options = {};

  ObjectAbstract.prototype._eventSeparator = new RegExp("\\s+");

  ObjectAbstract.prototype._validEventName = function(event) {
    if (typeof event !== 'string') {
      return false;
    }
    return true;
  };

  ObjectAbstract.prototype._validCallback = function(callback) {
    if (typeof callback !== 'function') {
      return false;
    }
    return true;
  };

  ObjectAbstract.prototype.on = function(events, callback) {
    var event, handlers, _i, _len, _ref;
    if (!this._validCallback(callback)) {
      return this;
    }
    _ref = events.split(this._eventSeparator);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      handlers = this._eventHandlers || (this._eventHandlers = {});
      if (handlers[event] === void 0) {
        handlers[event] = [];
      }
      handlers[event].push(callback);
    }
    return this;
  };

  ObjectAbstract.prototype.off = function(event, callbackToRemove) {
    var callback, handlers, stack, _i, _len, _ref;
    if (!(handlers = this._eventHandlers)) {
      return this;
    }
    if (!this._validEventName(event)) {
      return this._eventHandlers = {};
    } else if (!this._validCallback(callbackToRemove)) {
      if (handlers[event] === void 0) {
        return this;
      }
      return delete handlers[event];
    } else {
      if (handlers[event] === void 0) {
        return this;
      }
      stack = [];
      _ref = handlers[event];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        if (callback !== callbackToRemove) {
          stack.push(callback);
        }
      }
      return handlers[event] = stack;
    }
  };

  ObjectAbstract.prototype.trigger = function() {
    var args, callback, event, handlers, _i, _len, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!(handlers = this._eventHandlers)) {
      return this;
    }
    if (!this._validEventName(event)) {
      return this;
    }
    if (handlers[event] === void 0) {
      return this;
    }
    _ref = handlers[event];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      callback.apply(this, args);
    }
    return this;
  };

  ObjectAbstract.prototype.addDefaults = function(defaults) {
    var option;
    if (this.options !== void 0) {
      for (option in this.options) {
        if (defaults[option] === void 0) {
          defaults[option] = this.options[option];
        }
      }
    }
    return this.options = defaults;
  };

  ObjectAbstract.prototype.setOptions = function(options) {
    var defaults, option;
    if (options !== void 0) {
      defaults = this.options;
      this.options = {};
      for (option in defaults) {
        if (options[option] !== void 0) {
          this.options[option] = options[option];
        } else {
          this.options[option] = defaults[option];
        }
      }
      return true;
    }
    return false;
  };

  return ObjectAbstract;

})();

module.exports = ObjectAbstract;
