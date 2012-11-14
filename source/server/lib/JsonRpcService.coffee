
ObjectAbstract = require('./ObjectAbstract')
JsonResponse = require('./JsonResponse')

############################

class JsonRpcService extends ObjectAbstract

  options:
    path: '/json-rpc'
    router: null
    api: null
    session: true

  # -----------------------------------

  sessionIdCharacters: 'qwertyuiopasdfghjklzxcvbnm0123456789'

  # -----------------------------------

  sessions: {}

  # -----------------------------------

  constructor: (options) ->
    @setOptions(options)

    #
    # Check for options
    #
    throw "JsonRpcService requires options.router" if not @options.router?
    throw "JsonRpcService requires options.api" if not @options.api?

    #
    # Set a route
    #
    @options.router.set @options.path, 'application/json', (req, res) =>

      #
      # Parse input from post string
      #
      try
        input = JSON.parse(req.postString)
      catch err
        console.error "HTTP >> Badly formatted JSON-RPC input"
        res.end("null")
        return

      #
      # Crawl through the public api to find the right method
      #
      throw "Missing method from user agent" if typeof input.method isnt 'string'

      apiNode = @options.api

      for attr in input.method.split('.')
        return console.log "Invalid api call" if typeof apiNode[attr] is 'undefined'
        apiNode = apiNode[attr]

      return console.log "Invalid api call" if typeof apiNode isnt 'function'

      #
      # Crete a response object
      #
      response = new JsonResponse(res, input.id)

      params = input.params[0]

      #
      # Get the session object
      #
      session = @getSession(params, response)

      #
      # Call the api!
      #
      apiNode(response, params, session)

  # -----------------------------------

  generateSessionId: ->
    sessionId = ''
    characters = @sessionIdCharacters.length
    for i in [0..29]
      sessionId += @sessionIdCharacters[Math.floor(Math.random() * characters)]

    sessionId

  # -----------------------------------

  createSession: (id) ->
    @sessions[id] = {}

  # -----------------------------------

  getSession: (params, response) ->
    if typeof params.__sessionId is 'string' and params.__sessionId.length is 30 and @sessions[params.__sessionId] isnt undefined
      #
      # Id is valid and session exists, restore
      #
      sessionId = params.__sessionId
      session = @sessions[sessionId]
    else
      #
      # Create a new session with a new sessionId
      #
      sessionId = @generateSessionId()
      session = @createSession(sessionId)

    #
    # Always send the sessionId back
    #
    response.set('__sessionId', sessionId)

    #
    # Return session object
    #
    session


############################

#
# export the class in the module
#
module.exports = JsonRpcService