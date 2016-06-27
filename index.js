'use strict';

var react = require('react');
var reactDomServer = require('react-dom/server');
var Handlebars = require('handlebars');
var fs = require('fs');
var merge = require('lodash.merge');
var path = require('path');
require('babel-register')({
  presets: [ 'es2015', "react" ]
});
require.extensions['.scss'] = () => { return; };
require.extensions['.css'] = () => { return; };
require.extensions['.png'] = () => { return; };

var defaultTemplateName = '/base-page-template.handlebars';

function SimpleReactWebpackStaticPlugin(options, templatePath) {
  var entrys = [];

  options.viewName = undefined;
  options.body = undefined;

  return {
    apply: function(compiler) {
        compiler.plugin("emit", function(compilation, callback) {

          var component;
          var entryKeys = Object.keys(compilation.options.entry);
          var key;
          var templateOptions;
          var basePageTemplatePath = templatePath ?
            path.join(compiler.context, templatePath) : path.join(__dirname, defaultTemplateName)
          var basePageTemplateRaw = fs.readFileSync(basePageTemplatePath, {
            encoding: 'utf8'
          });
          var basePageTemplate = Handlebars.compile(basePageTemplateRaw);

          for(var iterator in compilation.options.entry) {
            component = require(
              path.join(compiler.context, compilation.options.entry[iterator])
            );
            entrys.push(reactDomServer.renderToStaticMarkup(react.createFactory(
              component[Object.keys(component)[0]]
            )(), {}));
          }

          entrys.forEach(function(source, iterator) {
            key = entryKeys[iterator];
            templateOptions = merge(options[key] || {});
            templateOptions = merge(templateOptions, {
              viewName: key,
              body: source
            });
            compilation.assets[key + '.html'] = {
              source: function(){
                return basePageTemplate(
                  merge(options.default || {}, templateOptions)
                );
              },
              size: function() {return source.length}
            }
          });

          entrys = [];

          callback();
        });
      }
  };
}

module.exports = SimpleReactWebpackStaticPlugin;
