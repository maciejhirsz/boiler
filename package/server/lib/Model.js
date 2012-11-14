var Model, ObjectAbstract;

ObjectAbstract = require('./ObjectAbstract');

Model = (function() {

  function Model() {}

  Model.prototype.options = {};

  Model.prototype.addDefaults = ObjectAbstract.prototype.addDefaults;

  Model.prototype.setOptions = ObjectAbstract.prototype.setOptions;

  return Model;

})();

module.exports = Model;
