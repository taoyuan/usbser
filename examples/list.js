/**
 * Created by taoyuan on 15/12/6.
 */

"use strict";

var usbser = require('../');

usbser.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port);
  });
});
