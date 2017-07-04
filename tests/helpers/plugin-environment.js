// https://github.com/webpack/webpack/blob/master/test/helpers/PluginEnvironment.js

export class PluginEnvironment {
	constructor() {
    var events = [];

  	this.getEnvironmentStub = function() {
  		return {
  			plugin: function(name, handler) {
  				events.push({
  					name,
  					handler
  				});
  			}
  		};
  	};

  	this.getEventBindings = function() {
  		return events;
  	};
  }
};
