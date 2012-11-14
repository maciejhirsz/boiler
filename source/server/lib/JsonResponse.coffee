
ObjectAbstract = require('./ObjectAbstract')

############################

class JsonResponse extends ObjectAbstract

  constructor: (response, id, data) ->
    @id = id
    @response = response
    if data is undefined
      @data = {}
    else
      @data = data

  # -----------------------------------

  has: (key) ->
    typeof @data[key] isnt 'undefined'

  # -----------------------------------

  get: (key) ->
    @data[key]

  # -----------------------------------

  set: (key, value) ->
    @data[key] = value

  # -----------------------------------

  send: ->
    @response.end JSON.stringify
      result: @data
      error: null
      id: @id

############################

#
# export the class in the module
#
module.exports = JsonResponse