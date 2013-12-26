#!/usr/local/bin/node

/**
 * Created by MarkDuckworth on 12/26/13.
 */
var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    exec = require('child_process').exec;
    
var app = express();
var config;

try {
  config = JSON.parse(fs.readFileSync("./config.json"));
  if (!config.cwd) config.cwd = "~/";
}
catch (e) {
  console.log("There was a problem parsing the config file.\n", e);
  process.exit(1);
}

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(app.router);
});

app.post('/git', function(req, res) {
    exec("git pull", {cwd: config.cwd}, function(error, stdout, sterr) {
      console.log(error, stdout, sterr);
    });
    res.end();
});

app.get('/', function(req, res) {
  res.send("githubhooks.js is working");
  res.end();
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
