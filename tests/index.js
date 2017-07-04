import test from 'ava';
import {applyPluginWithOptions} from './helpers/apply-plugin-with-options';
import baseTemplate from '../base-page-template';
import SimpleReactWebpackStaticPlugin from '../index.js';

const templateOptions = {
  "default": {"title": "I am a title"}
};

test('initializing with defaults', t => {
  let instance = new SimpleReactWebpackStaticPlugin(templateOptions);

  t.is(typeof instance.apply, "function", "The instance has an apply method");
});

test('initializing witout required arguments', t => {

  try {

    let instance = new SimpleReactWebpackStaticPlugin();
    if (instance) t.fail();

  } catch(e) {
    t.pass();
  }
});

test('initializing witout required default page config object', t => {

  try {

    let instance = new SimpleReactWebpackStaticPlugin({});
    if (instance) t.fail();

  } catch(e) {
    t.pass();
  }

});

test('initializing witout required default page title', t => {

  try {

    let instance = new SimpleReactWebpackStaticPlugin({"default": {}});
    if (instance) t.fail();

  } catch(e) {
    t.pass();
  }

});

test('ignore extensions option is working', t => {

  let webpackOptions = {
    entry: {
      index: __dirname + "/helpers/react-component-with-imported-css.jsx"
    }
  };

  let compilation = {
    options: webpackOptions,
    assets: {}
  };

  let pluginContext = new applyPluginWithOptions(SimpleReactWebpackStaticPlugin, templateOptions, {
    "ignore-extensions": ["css"]
  });

  pluginContext[0].handler(compilation, done => {
    t.pass();
  });

});
