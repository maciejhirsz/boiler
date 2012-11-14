
ObjectAbstract = require('./ObjectAbstract')

############################

class Session extends ObjectAbstract
  id: null

  # -----------------------------------

  constructor: ->
    @data = {}

  # -----------------------------------

  getId: ->
    @id

  # -----------------------------------

  set: (key, value) ->
    @data[key] = value

  # -----------------------------------

  get: (key) ->
    @data[key]