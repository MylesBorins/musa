#!/usr/bin/env node
var path = require('path');
var spawn = require('child_process').spawn;

var mousai = require('../lib');

var appCfg = require('application-config');
var argv = require('minimist')(process.argv.slice(2));

var command = argv._[0];
var args = argv._.slice(1);

var audioPath = path.join(__dirname, '../audio/elevator.mp3');

var playSong = mousai({
  path: audioPath,
  repeat: true
});

var child = spawn(command, args, {
  stdio: 'inherit'
});

child.on('close', function () {
  playSong.kill();
});
