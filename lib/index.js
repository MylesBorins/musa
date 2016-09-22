'use strict';
var fs = require('fs');
var path = require('path');

var lame = require('lame');
var Speaker = require('speaker');
var pump = require('pump')

function musa(options) {
  var read = fs.createReadStream(options.path);
  var decoder = new lame.Decoder();
  var speaker = new Speaker();
  pump(read, decoder, speaker, function (muerr) {
    if (options.repeat)
      musa(options);
  });
}

module.exports = musa;
