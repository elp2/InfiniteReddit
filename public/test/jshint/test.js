fs = require('fs')
assert = require('assert')
JSHINT = require('./jshint.js').JSHINT;


function testScripts(scripts, options) {
	for(var i in scripts) {
		var script = scripts[i];
		console.log("\n=====================\n", script, "\n=====================\n")
		var src = fs.readFileSync(__dirname + "/../../js/" + script, "utf8");

		JSHINT(src, options) ;
		var errors = JSHINT.errors;
		for (var i = errors.length - 1; i >= 0; i--) {
			var err = errors[i];
			if(err) {
				console.log(err.reason, "@", err.line, ":", err.character, "\n[", err.reason, "]\n");
			}
		}
		console.log(script, errors.length, "ERRORS");
	}
}

var scripts = ["reddit.js", "gallery.js"];

testScripts(scripts);