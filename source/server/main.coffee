
lib = require('./lib')

router = new lib.Router
server = new lib.Server
  router: router
  host: "192.168.42.134"

#jsonRpc = new lib.JsonRpcService
#  router: router
#  api: app

server.start()