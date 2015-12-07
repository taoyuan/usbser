/**
 * Created by taoyuan on 15/12/7.
 */

"use strict";

var fs = require('fs');
var usbser = require('../');

usbser.watch('/dev')
  .on('ready', function () {
    console.log('ready');
  })
  .on('created', function (f, stat) {
    var realpath = fs.realpathSync(f);
    console.log('created', f, '->', realpath);
  })
  .on('removed', function (f, stat) {
    console.log('removed', f);
  });
