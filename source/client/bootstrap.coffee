require.config
  #
  # Base URL
  #
  baseUrl: "/assets",

  # ---------------------------------------------

  #
  # Append to each required file to prevent caching
  #
  urlArgs: "bust=" + new Date().getTime()

  # ---------------------------------------------

  #
  # Load these modules first
  #
  priority: ['jquery']

  # ---------------------------------------------

  paths:
    jquery: 'vendor/jquery/jquery-1.8.0.min'
    text: 'vendor/requirejs/text'
    hogan: 'vendor/hoganjs/hogan-2.0.0.amd'
    underscore: 'vendor/backbone/underscore-1.3.3'
    backbone: 'vendor/backbone/backbone-0.9.2'
    rippl: 'vendor/rippl/rippl.min'

  # ---------------------------------------------

  shim:
    backbone:
      deps: ['underscore', 'jquery']
      exports: 'Backbone'
    underscore:
      exports: '_'
    jquery:
      exports: '$'

#################################################

require ['js/main']