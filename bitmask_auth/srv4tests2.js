/*jshint node: true*/
/* connect module must be in a node_modules dir up */
var connect = require('connect');
connect().use(connect.static(__dirname)).listen(3000);
