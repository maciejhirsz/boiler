(function(window) {

  var files   = {},
      modules = {},
      require;

//#!files

  require = function(path) {
    var module;
    // Clear incoming path from heading './' or tailing '.js'
    path = path.replace(/^\.\//, '').replace(/\.js$/i, '');

    // Module not in the hash?
    if (modules[path] === void 0) {

      // Throw an exception if there is no source coresponding to the module
      if (files[path] === void 0) { throw "Unknown module: " + path; }

      // Declare a new module and add it to the modules hash
      module = modules[path] = { exports: {} };

      // Parse the file string, pass module object and require function to it
      eval("(function(module, require){" + files[path] + "})")(module, require);

      // Drop the file string to save some memory now it's been parsed
      delete files[path];

      // Return module exports
      return module.exports
    }

    // Module in the hash? awesome!
    return modules[path].exports;
  };

  // Require 'main' by default
  require('main');

})(window);