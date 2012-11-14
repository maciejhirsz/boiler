
ObjectAbstract = require('./ObjectAbstract')

############################

class Router extends ObjectAbstract

  options: {}

  # -----------------------------------

  paths: {}

  # -----------------------------------

  constructor: (options) ->
    @setOptions(options)

  # -----------------------------------

  set: (path, contentType, callback) ->
    @paths[path] =
      contentType: contentType
      callback: callback

  # -----------------------------------

  route: (pathString, req, res) ->
    #
    # Handle hardcoded paths
    #
    if @paths[pathString]?
      path = @paths[pathString]
      res.writeHead(200, 'Content-Type': path.contentType);
      path.callback(req, res)
      return true

    #
    # Will trigger file router on the server
    #
    return false

############################

#
# export the class in the module
#
module.exports = Router