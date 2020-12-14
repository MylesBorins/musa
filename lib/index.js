'use strict';
const {createReadStream} = require('fs');

const { Decoder } = require('@suldashi/lame');
const Speaker = require('speaker');
const pump = require('pump')

function musa(options) {
  const read = createReadStream(options.path);
  const decoder = new Decoder();
  const speaker = new Speaker();

  pump(read, decoder, speaker, function (err) {
    if (err) throw err;
    if (options.repeat)
      musa(options);
  });
}

module.exports = musa;
