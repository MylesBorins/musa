#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var musa = require('../lib');

var appCfg = require('application-config');
var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));

var command = argv._[0];
var args = argv._.slice(1);
var config = appCfg('node-musa');

var elevator = path.join(__dirname, '../audio/elevator.mp3');

if (!command && !argv.set && !argv.reset && !argv.trash) {
  help();
  process.exit(1);
}

if (argv.h || argv.help) {
  help();
  process.exit(0);
}

if (argv.set) {
  var mp3Path = fs.realpathSync(argv.set);
  config.write({
    path: mp3Path
  }, function (err) {
    console.log(chalk.yellow('Default Set To: ') + mp3Path);
  });
}
else if (argv.reset) {
  config.write({
    path: elevator
  }, function () {
    console.log(chalk.yellow('Default Reset To: ') + elevator);
    return;
  });
}
else if (argv.trash) {
  config.trash(function () {
    console.log('Config has been ' + chalk.red('TRASHED'));
    return;
  });
}
else {
  config.read(afterConfigRead);
}

function help() {
  console.log(chalk.yellow('\n    Usage') + ':\n\t$ musa [some cmd and arguments] # play song while command runs\n\t$ mousa --set [path to mp3] # set default song\n');
}

function afterConfigRead(err, options) {
  if (options.path) {
    run(options);
    return;
  }
  else {
    options = {
      path: elevator
    }
  }
  config.write(options, function () {
    run(options);
    return;
  });
}

function run(options) {
  console.log(options)
  var playSong = musa({
    path: options.path,
    repeat: true
  });

  var child = spawn(command, args, {
    stdio: 'inherit'
  });

  child.on('error', function (err) {
    if (err.code === 'ENOENT'); {
      console.error(chalk.red('\nError:') + ' the command ' + chalk.yellow(command) + ' does not exist.\n');
      process.exit(1);
    }
  });

  child.on('close', function () {
    playSong.kill();
  });
}
