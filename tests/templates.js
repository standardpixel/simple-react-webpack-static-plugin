import test from 'ava';
import {applyPluginWithOptions} from './helpers/apply-plugin-with-options';
import baseTemplate from '../base-page-template';
import SimpleReactWebpackStaticPlugin from '../index.js';

const templateOptions = {
  "default": {"title": "I am a title"}
};

test('generates one file per entry', t => {

  let webpackOptions = {
    entry: {
      index: __dirname + "/helpers/react-component.jsx",
      about: __dirname + "/helpers/react-component.jsx"
    }
  };

  let compilation = {
    options: webpackOptions,
    assets: {}
  };

  let pluginContext = new applyPluginWithOptions(SimpleReactWebpackStaticPlugin, templateOptions);

  pluginContext[0].handler(compilation, done => {
    t.is(
      Object.keys(compilation.assets).length,
      2,
      "The number of assets does not match the entries configured"
    );
  });

});

test('loads default template when a custom one is not configured', t => {

  let webpackOptions = {
    entry: {
      index: __dirname + "/helpers/react-component.jsx"
    }
  };

  let compilation = {
    options: webpackOptions,
    assets: {}
  };

  let pluginContext = new applyPluginWithOptions(SimpleReactWebpackStaticPlugin, templateOptions);

  pluginContext[0].handler(compilation, done => {
    t.is(
      compilation.assets["index.html"].source(), //actual
      baseTemplate({
        viewName: "index",
        title: templateOptions.default.title,
        body: "<div><h1>Test React component</h1></div>"
      }), // Expected
      "The template output generated does not match the expected output if the index entry point"
    );
  });
});

test('custom templates can be set', t => {

  let webpackOptions = {
    entry: {
      index: __dirname + "/helpers/react-component.jsx"
    }
  };

  let compilation = {
    options: webpackOptions,
    assets: {}
  };

  let pluginContext = new applyPluginWithOptions(SimpleReactWebpackStaticPlugin, templateOptions, {template: data => {
    return "Custom string";
  }});

  pluginContext[0].handler(compilation, done => {
    t.is(
      compilation.assets["index.html"].source(), //actual
      "Custom string", // Expected
      "The custom template output generated does not match the expected output if the index entry point"
    );
  });

});
