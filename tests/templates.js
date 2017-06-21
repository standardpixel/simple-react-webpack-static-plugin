import test from 'ava';
import SimpleReactWebpackStaticPlugin from '../index.js';
import baseTemplate from '../base-page-template';

var templateOptions = {
  "default": {"title": "I am a title"}
};

test('default template loads correctly', t => {
  let instance = new SimpleReactWebpackStaticPlugin(templateOptions);

  var compilerStub = {
    assets: {},
    options: {
      entry: ["react-component.jsx"],
    }
  };

  instance.apply({
    context: __dirname + "/helpers",
    plugin: (label,emit) => {
      emit(compilerStub, done => {
        t.is(
          compilerStub.assets["0.html"].source(),
          baseTemplate(templateOptions.default),
          "The rendered template does not match the expected template"
        );
      });
    }
  });
});
