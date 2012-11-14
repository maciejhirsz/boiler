
ObjectAbstract = require('./ObjectAbstract')
Router = require('./Router')
http = require('http')
url = require('url')
querystring = require('querystring')
path = require('path')
fs = require('fs')

############################

class Server extends ObjectAbstract

  options:
    #
    # server host and port
    #
    host: '127.0.0.1'
    port: 1337

    #
    # path to serve assets from
    #
    publicPath: './public'

    #
    # default index file
    #
    indexFile: 'index.html'

    #
    # Default content type
    #
    defaultContentType: 'application/octet-stream'

  # -----------------------------------

  types:
    #
    # Text
    #
    'txt':    'text/plain'
    #
    # HTML and XML
    #
    'htm':    'text/html'
    'html':   'text/html'
    'htmls':  'text/html'
    'xml':    'application/xml'
    'xhtml':  'application/xhtml+xml'
    #
    # JS & CSS
    #
    'js':     'application/x-javascript'
    'css':    'text/css'
    #
    # Image types
    #
    'bmp':    'image/bmp'
    'jpg':    'image/jpeg'
    'jpeg':   'image/jpeg'
    'jpe':    'image/jpeg'
    'png':    'image/png'
    'gif':    'image/gif'
    'svg':    'image/svg+xml'
    #
    # Multimedia types
    #
    'avi':    'video/x-msvideo'
    'mpg':    'video/mpeg'
    'mpeg':   'video/mpeg'
    'mp4':    'video/mp4'
    'wm':     'video/x-ms-wm'
    'h261':   'video/h261'
    'h263':   'video/h263'
    'h264':   'video/h264'
    'flv':    'video/x-flv'
    'f4v':    'video/x-f4v'
    'swf':    'application/x-shockwave-flash'
    'fxp':    'application/vnd.adobe.fxp'
    'mp3':    'audio/mpeg'
    'm4a':    'audio/mp4'
    'mp4a':   'audio/mp4'
    'ogg':    'audio/ogg'
    'oga':    'audio/ogg'
    'webma':  'audio/webm'
    'wav':    'audio/wav'
    #
    # Font types
    #
    'woff':   'font/woff'
    'ttf':    'font/ttf'
    'eot':    'font/eot'
    'otf':    'font/otf'
    #
    # Document types
    #
    'csv':    'text/csv'
    'sxc':    'application/vnd.sun.xml.calc'
    'odt':    'application/vnd.oasis.opendocument.text'
    'doc':    'application/msword'
    'xls':    'application/vnd.ms-excel'
    'ppt':    'application/vnd.ms-powerpoint'
    'docx':   'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    'pptx':   'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    'xlsx':   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    'pdf':    'application/pdf'
    #
    # Archive types
    #
    'zip':    'application/zip'
    'rar':    'application/x-rar-compressed'
    'tar':    'application/x-tar'
    'gz':     'application/gzip'
    '7z':     'application/x-7z-compressed'
    #
    # Executable / Disc Image files
    #
    'sh':     'application/x-sh'
    'exe':    'application/x-msdownload'
    'msi':    'application/x-msi'
    'dmg':    'application/x-apple-diskimage'
    'bin':    'application/octet-stream'

  # -----------------------------------

  constructor: (options) ->
    @setOptions(options)
    #
    # create a defaut router only if no object was given in options
    #
    if not @options.router?
      router = new Router
    else
      router = @options.router

    #
    # Create a native node http server
    #
    @_server = http.createServer (request, response) =>
      try
        #
        # Handle POST data
        #
        request.postString = ''
        request.on 'data', (data) =>
          request.postString += data

        #
        # Handle request when it's all sent
        #
        request.on 'end', =>
          #
          # Parse URL and get pathString from it
          #
          parsedUrl = url.parse(request.url, true)

          request.post = querystring.parse(request.postString)
          request.get = parsedUrl.query

          pathString = path.normalize(parsedUrl.pathname)

          #
          # Log request
          #
          console.log("HTTP >> #{request.url} : Request ")

          #
          # Do not allow to get out of the public path!
          #
          if pathString[0..2] is './' or pathString[0..3] is '../'
            res.writeHead(500, 'Content-Type': 'text/plain');
            res.end('Internal server error')
            console.log("HTTP !! #{request.url} : ERROR 500")
            return

          #
          # Send path to the router, if fail attempt to route to a file in public path
          #
          @routeFile(pathString, request, response) if not router.route(pathString, request, response)

          #
          # Log response (not very accurate as router route can be async)
          #
          console.log("HTTP << #{request.url} : Response")

      catch err
        console.log("HTTP -- ERROR: #{err}")

  # -----------------------------------

  getExtensionFromPath: (path) ->
    #
    # Grabs extension from path string
    #
    path = path.split('.')
    return if path.length < 2
    return path.pop()

  # -----------------------------------

  routeFile: (pathString, req, res) ->
    #
    # Handle file paths
    #
    if pathString.slice(-1) is '/'
      pathString = path.join(@options.publicPath, pathString, @options.indexFile)
    else
      pathString = path.join(@options.publicPath, pathString)

    #
    # Check if path exist and is a file
    #
    fs.stat pathString, (err, stats) =>
      #
      # Handle 404
      #
      if err or not stats.isFile()
        res.writeHead(404, 'Content-Type': 'text/plain');
        res.end("Page not found")

      #
      # Attempt to read file
      #
      else
        fs.readFile pathString, (err, data) =>
          #
          # Handle 500
          #
          if err
            res.writeHead(500, 'Content-Type': 'text/plain');
            res.end('Internal server error')

          else
            #
            # Handle content type based on file extension
            #
            fileExt = @getExtensionFromPath(pathString)

            contentType = @types[fileExt]
            contentType = @options.defaultContentType if contentType is undefined

            #
            # Handling the data range
            #
            total = data.length

            if req.headers.range isnt undefined
              #
              # Partial data
              #
              parts = req.headers.range.replace(/bytes=/, "").split("-")
              partialstart = parts[0]
              partialend = parts[1]

              start = Number(partialstart)
              if partialend != ''
                end = Number(partialend)
              else
                end = total-1

              data = data.slice(start, end+1)

              chunksize = (end-start)+1

            else
              #
              # Whole data
              #
              start = 0
              end = total-1
              end = 0 if end < 0
              chunksize = total

            #
            # Set headers
            #
            res.writeHead(200,
              'Content-Type': @types[fileExt]
              'Content-Length': data.length
              'Content-Range': "bytes #{start}-#{end}/#{total}"
              'Accept-Ranges': 'bytes'
            )

            #
            # Return contents of the file
            #
            res.end(data)

  # -----------------------------------

  start: ->
    @_server.listen(@options.port, @options.host)
    console.log("HTTP -- Server running at http://#{@options.host}:#{@options.port}/");

  # -----------------------------------

  stop: ->
    @_server.close(@options.port, @options.host)
    console.log("HTTP -- Server stopped at http://#{@options.host}:#{@options.port}/");


############################

#
# export the class in the module
#
module.exports = Server