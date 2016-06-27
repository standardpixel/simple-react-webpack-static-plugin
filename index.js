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

const defaultTemplateName = '/base-page-template.handlebars';
const pluginName = 'SimpleReactWebpackStaticPlugin';

class SimpleReactWebpackStaticPlugin {

  constructor(pages, options) {

    // Assert required stuff
    if(!pages) {
      throw new Error(`${pluginName} requires the first argument be an object with template content`);
    }
    if(!pages.default) {
      throw new Error(`${pluginName} requires the first argument be an object with template content`);
    }
    if(!pages.default.title) {
      throw new Error(`${pluginName} requires the default template config requires a title attribute`);
    }

    // Defaults for optional stuff
    pages.viewName = undefined;
    pages.body = undefined;
    options = options || {};
    options["ignore-extensions"] = [];

    // Some file extensions should noop instead of trying to run
    // as javascript.
    for(let extension of options["ignore-extensions"]) {
      require.extensions[`.${extension}`] = () => { return; };
    }

    //Set properties
    this.name = ${pluginName}
    this.options = options;
    this.pages = pages;
    this.entrys = [];

  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, done) => {
      let component;
      let entryKeys = Object.keys(compilation.options.entry);
      let key;
      let templateOptions;
      let basePageTemplatePath = this.options.template ?
        path.join(compiler.context, this.options.template) : path.join(__dirname, defaultTemplateName)
      let basePageTemplateRaw = fs.readFileSync(basePageTemplatePath, {
        encoding: 'utf8'
      });
      var basePageTemplate = Handlebars.compile(basePageTemplateRaw);

      for(let iterator in compilation.options.entry) {
        component = require(
          path.join(compiler.context, compilation.options.entry[iterator])
        );
        this.entrys.push(reactDomServer.renderToStaticMarkup(react.createFactory(
          component[Object.keys(component)[0]]
        )(), {}));
      }

      this.entrys.forEach((source, iterator) => {
        key = entryKeys[iterator];
        templateOptions = merge(this.pages[key] || {});
        templateOptions = merge(templateOptions, {
          viewName: key,
          body: source
        });
        compilation.assets[key + '.html'] = {
          source: () => {
            return basePageTemplate(
              merge(this.pages.default || {}, templateOptions)
            );
          },
          size: () => {return source.length}
        }
      });

      this.entrys = [];

      done();
    });
  }
}

module.exports = SimpleReactWebpackStaticPlugin;
