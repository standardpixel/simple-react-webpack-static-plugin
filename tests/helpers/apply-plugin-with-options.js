//https://github.com/webpack/webpack/blob/master/test/helpers/applyPluginWithOptions.js

import {PluginEnvironment} from "./plugin-environment";

export class applyPluginWithOptions {
  constructor(Plugin) {
    var plugin = new (Function.prototype.bind.apply(Plugin, arguments));
  	var pluginEnvironment = new PluginEnvironment();
  	plugin.apply(pluginEnvironment.getEnvironmentStub());

  	var env = (this === global) ? {} : this;
  	env.plugin = plugin;
  	env.pluginEnvironment = pluginEnvironment;

  	return pluginEnvironment.getEventBindings();
  }
};
