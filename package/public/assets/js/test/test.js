
define(function(require) {
  var module;
  console.log('inside test.coffee');
  return module = {
    hello: function() {
      return document.body.innerHTML = require('text!templates/hello.mustache');
    }
  };
});
