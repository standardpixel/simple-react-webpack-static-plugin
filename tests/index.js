import test from 'ava';
import SimpleReactWebpackStaticPlugin from '../index.js';

test('initializing with defualts', t => {
  let instance = new SimpleReactWebpackStaticPlugin({
    "default": {"title": "I am a title"}
  });

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
