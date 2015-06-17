/*jshint node: true*/
/* express module must be in a node_modules dir up */
var express = require('express');
express().use(express.static(__dirname)).listen(3000);
