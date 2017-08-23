'use strict';

var react = require('react');
var reactDomServer = require('react-dom/server');
var basePageTemplate = require("./base-page-template");
var fs = require('fs');
var merge = require('lodash.merge');
var path = require('path');
require('babel-register')({
  presets: [ 'es2015', "react" ]
});

const pluginName = 'SimpleReactWebpackStaticPlugin';

function getObjectValues(object) {
  return Object.keys(object).map(key => {
    return object[key];
  });
}

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
    let _ignoreExtensions = options["ignore-extensions"] || [];

    // Some file extensions should noop instead of trying to run
    // as javascript.
    for(let extension of _ignoreExtensions) {
      require.extensions[`.${extension}`] = () => { return; };
    }

    //Set properties
    this.name = pluginName
    this.options = options;
    this.pages = pages;
    this.entries = {};

  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, done) => {
      let component;
      let entryKeys = Object.keys(compilation.options.entry);
      let key;
      let templateOptions;
      let pageTemplate = this.options.template || basePageTemplate;

      for(let iterator in compilation.options.entry) {
        let pathValue = compilation.options.entry[iterator];
        let stringPathValue = Array.isArray(pathValue) ? pathValue[1] : pathValue;
        component = require(compiler.context + stringPathValue.substring(1));
        this.entries[iterator] = reactDomServer.renderToStaticMarkup(react.createFactory(
          component[Object.keys(component)[0]]
        )(), {});
      }

      Object.keys(this.entries).forEach((key, iterator) => {
        let source  = this.entries[key];
        compilation.assets[key + '.html'] = {
          source: () => {
            return pageTemplate(
              merge(this.pages.default || this.pages[key] || {}, merge(templateOptions, {
                viewName: entryKeys[iterator],
                body: source
              }))
            );
          },
          size: () => {return source.length}
        }
      });

      if (this.options.directories) {
        let newMembers = {};

        for (let index in compilation.assets) {
          let name = index.substring(0, index.length-5);
          if (name !== "index") {
            if (index.substring(name.length) === ".html") {
              newMembers[name] = `${name}/index.html`;
              compilation.assets[newMembers[name]] = compilation.assets[index];
              delete compilation.assets[index];
            }
          }
        }

        for (let index in compilation.assets) {
          if (getObjectValues(newMembers).indexOf(index) === -1) {
            Object.keys(newMembers).forEach(function(item) {
              if (index.substring(0, item.length) === item && index.substring(item.length, item.length+1) === ".") {
                compilation.assets[`${item}/${index}`] = compilation.assets[index];
                delete compilation.assets[index];
              }
            });
          }
        }
      }

      this.entries = [];

      done();
    });
  }
}

module.exports = SimpleReactWebpackStaticPlugin;
