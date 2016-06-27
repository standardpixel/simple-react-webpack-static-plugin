# simple-react-webpack-static-plugin

[![Build Status](https://travis-ci.org/standardpixel/simple-react-webpack-static-plugin.svg?branch=master)](https://travis-ci.org/standardpixel/simple-react-webpack-static-plugin)

 This Webpack plug-in does one thing really well. When pluged in to a webpack config with one or more JSX entry-points, it will generate a static HTML file for each of those entry-points. This is so that your site will have static content for any reason you might like to have that.

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
