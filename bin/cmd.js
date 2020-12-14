#!/usr/bin/env node
const {resolve} = require('path');
const {realpathSync} = require('fs');
const {spawn} = require('child_process');

const musa = require('../lib');

const appCfg = require('application-config');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));

const command = argv._[0];
const args = argv._.slice(1);
const config = appCfg('node-musa');

const elevator = resolve(__dirname, '../audio/elevator.mp3');

function help() {
  console.log(`\n\t${chalk.yellow('Usage')}:\n\n\t$ musa [some cmd and arguments] `
    + '# play song while command runs\n\t$ musa --set [path to mp3] # set default song\n');
}

function run(options) {
  const playSong = musa({
    path: options.path || elevator,
    repeat: true
  });

  const child = spawn(command, args, {
    stdio: 'inherit'
  });

  child.on('error', (err) => {
    throw err;
  });

  child.on('close', _ => {
    process.exit(0);
  });
}

if ((!command && !argv.set && !argv.reset && !argv.trash) || argv.h || argv.help) {
  help();
  process.exit(0);
}

if (argv.set) {
  const mp3Path = realpathSync(argv.set);
  config.write({
    path: mp3Path
  }, (err) => {
    if (err) throw err;
    console.log(chalk.yellow('Default Set To: ') + mp3Path);
  });
}
else if (argv.reset) {
  config.write({
    path: elevator
  }, (err) => {
    if (err) throw err;
    console.log(chalk.yellow('Default Reset To: ') + elevator);
  });
}
else if (argv.trash) {
  config.trash(function (err) {
    if (err) throw err;
    console.log('Config has been ' + chalk.red('TRASHED'));
  });
}
else {
  config.read((err, options) => {
    if (err) throw err;
    run(options);
  });
}
