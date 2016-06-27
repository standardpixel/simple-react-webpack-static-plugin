# simple-react-webpack-static-plugin

[![Build Status](https://travis-ci.org/standardpixel/simple-react-webpack-static-plugin.svg?branch=master)](https://travis-ci.org/standardpixel/simple-react-webpack-static-plugin)

This plugin creates an HTML file with static markup from each JSX entry-point in a webpack config. It expects you have written your application to use ES-2015.

## Example Usage

_webpack.config.js_
```
var SimpleReactWebpackStaticPlugin = require('simple-react-webpack-static-plugin');

module.exports = {
  entry: {
    index: './path/to.jsx'
  },

  plugins: [
    new SimpleReactWebpackStaticPlugin({
      "default": {
        "title": "The title for your website"
      },
    })
  ]
};
```

## Interface
  * SimpleReactWebpackStaticPlugin Arguments
    * **pages** (object) _Required_ [Configuration for page templates, contains keys matching the names of each entry point in your webpack config and a default]
      * **default** (object) _Required_ [Mustache template variables]
        * **title** (string) _Required for default template_ [Page title]
  * **options** (object) _Optional_
    **template** (string) _Optional_ [An override mustache template]
    **ingnore-extras** (array) _Optional_ [File extensions for NodeJs to ignore when reading your modules. This is useful if you are using webpack loaders to load non-javascript files]
