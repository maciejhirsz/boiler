var Collection, Model, ObjectAbstract;

ObjectAbstract = require('./ObjectAbstract');

Model = require('./Model');

Collection = (function() {

  function Collection() {}

  Collection.prototype.options = {};

  Collection.prototype.model = Model;

  Collection.prototype.addDefaults = ObjectAbstract.prototype.addDefaults;

  Collection.prototype.setOptions = ObjectAbstract.prototype.setOptions;

  return Collection;

})();

module.exports = Collection;
