#!/usr/bin/env node

const express = require("express");
const http = require("http");

const STATIC_PATH = "./www/";
const HOSTS = [
	"localhost",
	"www.savino.systems",
	"savino-systems-site.herokuapp.com"
];
const PORT = getArg("--port") || getArg("-p") || process.env.PORT || 8888;

var expressApp = null;
var httpServer = null;

(function init(){
	//Express server
	expressApp = express();

	//Hosts
	expressApp.use(verifyHost);
	
	//Static
	expressApp.use(express.static(STATIC_PATH));

	//Node server
	httpServer = http.createServer(expressApp);

	//Listen
	expressApp.listen(PORT, () => {
		console.log(`Listening on http://${HOSTS[0]}:${PORT}`);
	});
})();

function verifyHost(req, res, next){
	var host = req.headers.host;
	if (host){
		if (HOSTS.indexOf(host.replace(/:\d+$/, "")) != -1){
			next();
			return;
		}
	}
	res.statusCode = 404;
	res.end();
}

function getArg(key){
	var index = process.argv.indexOf(key);
	var next = process.argv[index + 1];
	return index < 0 ? null : !next || next[0] === "-" ? true : next;
}