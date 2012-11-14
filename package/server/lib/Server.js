var ObjectAbstract, Router, Server, fs, http, path, querystring, url,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ObjectAbstract = require('./ObjectAbstract');

Router = require('./Router');

http = require('http');

url = require('url');

querystring = require('querystring');

path = require('path');

fs = require('fs');

Server = (function(_super) {

  __extends(Server, _super);

  Server.prototype.options = {
    host: '127.0.0.1',
    port: 1337,
    publicPath: './public',
    indexFile: 'index.html',
    defaultContentType: 'application/octet-stream'
  };

  Server.prototype.types = {
    'txt': 'text/plain',
    'htm': 'text/html',
    'html': 'text/html',
    'htmls': 'text/html',
    'xml': 'application/xml',
    'xhtml': 'application/xhtml+xml',
    'js': 'application/x-javascript',
    'css': 'text/css',
    'bmp': 'image/bmp',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'jpe': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'avi': 'video/x-msvideo',
    'mpg': 'video/mpeg',
    'mpeg': 'video/mpeg',
    'mp4': 'video/mp4',
    'wm': 'video/x-ms-wm',
    'h261': 'video/h261',
    'h263': 'video/h263',
    'h264': 'video/h264',
    'flv': 'video/x-flv',
    'f4v': 'video/x-f4v',
    'swf': 'application/x-shockwave-flash',
    'fxp': 'application/vnd.adobe.fxp',
    'mp3': 'audio/mpeg',
    'm4a': 'audio/mp4',
    'mp4a': 'audio/mp4',
    'ogg': 'audio/ogg',
    'oga': 'audio/ogg',
    'webma': 'audio/webm',
    'wav': 'audio/wav',
    'woff': 'font/woff',
    'ttf': 'font/ttf',
    'eot': 'font/eot',
    'otf': 'font/otf',
    'csv': 'text/csv',
    'sxc': 'application/vnd.sun.xml.calc',
    'odt': 'application/vnd.oasis.opendocument.text',
    'doc': 'application/msword',
    'xls': 'application/vnd.ms-excel',
    'ppt': 'application/vnd.ms-powerpoint',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',
    '7z': 'application/x-7z-compressed',
    'sh': 'application/x-sh',
    'exe': 'application/x-msdownload',
    'msi': 'application/x-msi',
    'dmg': 'application/x-apple-diskimage',
    'bin': 'application/octet-stream'
  };

  function Server(options) {
    var router,
      _this = this;
    this.setOptions(options);
    if (!(this.options.router != null)) {
      router = new Router;
    } else {
      router = this.options.router;
    }
    this._server = http.createServer(function(request, response) {
      try {
        request.postString = '';
        request.on('data', function(data) {
          return request.postString += data;
        });
        return request.on('end', function() {
          var parsedUrl, pathString;
          parsedUrl = url.parse(request.url, true);
          request.post = querystring.parse(request.postString);
          request.get = parsedUrl.query;
          pathString = path.normalize(parsedUrl.pathname);
          console.log("HTTP >> " + request.url + " : Request ");
          if (pathString.slice(0, 3) === './' || pathString.slice(0, 4) === '../') {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.end('Internal server error');
            console.log("HTTP !! " + request.url + " : ERROR 500");
            return;
          }
          if (!router.route(pathString, request, response)) {
            _this.routeFile(pathString, request, response);
          }
          return console.log("HTTP << " + request.url + " : Response");
        });
      } catch (err) {
        return console.log("HTTP -- ERROR: " + err);
      }
    });
  }

  Server.prototype.getExtensionFromPath = function(path) {
    path = path.split('.');
    if (path.length < 2) {
      return;
    }
    return path.pop();
  };

  Server.prototype.routeFile = function(pathString, req, res) {
    var _this = this;
    if (pathString.slice(-1) === '/') {
      pathString = path.join(this.options.publicPath, pathString, this.options.indexFile);
    } else {
      pathString = path.join(this.options.publicPath, pathString);
    }
    return fs.stat(pathString, function(err, stats) {
      if (err || !stats.isFile()) {
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        return res.end("Page not found");
      } else {
        return fs.readFile(pathString, function(err, data) {
          var chunksize, contentType, end, fileExt, partialend, partialstart, parts, start, total;
          if (err) {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            return res.end('Internal server error');
          } else {
            fileExt = _this.getExtensionFromPath(pathString);
            contentType = _this.types[fileExt];
            if (contentType === void 0) {
              contentType = _this.options.defaultContentType;
            }
            total = data.length;
            if (req.headers.range !== void 0) {
              parts = req.headers.range.replace(/bytes=/, "").split("-");
              partialstart = parts[0];
              partialend = parts[1];
              start = Number(partialstart);
              if (partialend !== '') {
                end = Number(partialend);
              } else {
                end = total - 1;
              }
              data = data.slice(start, end + 1);
              chunksize = (end - start) + 1;
            } else {
              start = 0;
              end = total - 1;
              if (end < 0) {
                end = 0;
              }
              chunksize = total;
            }
            res.writeHead(200, {
              'Content-Type': _this.types[fileExt],
              'Content-Length': data.length,
              'Content-Range': "bytes " + start + "-" + end + "/" + total,
              'Accept-Ranges': 'bytes'
            });
            return res.end(data);
          }
        });
      }
    });
  };

  Server.prototype.start = function() {
    this._server.listen(this.options.port, this.options.host);
    return console.log("HTTP -- Server running at http://" + this.options.host + ":" + this.options.port + "/");
  };

  Server.prototype.stop = function() {
    this._server.close(this.options.port, this.options.host);
    return console.log("HTTP -- Server stopped at http://" + this.options.host + ":" + this.options.port + "/");
  };

  return Server;

})(ObjectAbstract);

module.exports = Server;
