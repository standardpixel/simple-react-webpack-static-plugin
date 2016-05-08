'use strict';

var react = require('react');
var reactDomServer = require('react-dom/server');
var Handlebars = require('handlebars');
var fs = require('fs');
var merge = require('lodash.merge');
require('babel-register')({
  presets: [ 'es2015', "react" ]
});

var basePageTemplateRaw = fs.readFileSync('./base-page-template.handlebars', {encoding: 'utf8'});
var basePageTemplate = Handlebars.compile(basePageTemplateRaw);

function StartStatic(options) {
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

          for(var iterator in compilation.options.entry) {
            component = require(compilation.options.entry[iterator]);
            entrys.push(reactDomServer.renderToString(react.createFactory(
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
              source: function(){return basePageTemplate(merge(options.default || {}, templateOptions))},
              size: function() {return source.length}
            }
          });

          entrys = [];

          callback();
        });
      }
  };
}

module.exports = StartStatic;
