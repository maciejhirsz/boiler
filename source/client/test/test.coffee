define (require) ->

  console.log('inside test.coffee')

  return module =
    hello: ->
      #
      # Just a demo code
      #
      document.body.innerHTML = require('text!templates/hello.mustache')