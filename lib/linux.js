/**
 * Created by taoyuan on 15/12/6.
 */

"use strict";


var fs = require('fs');
var path = require('path');
var async = require('async');
var exec = require('child_process').exec;

function portify(path, callback) {
  function udev_parser(udev_output, callback) {
    function udev_output_to_json(output) {
      var result = {};
      var lines = output.split('\n');
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line !== '') {
          var line_parts = lines[i].split('=');
          result[line_parts[0].trim()] = line_parts[1].trim();
        }
      }
      return result;
    }

    var as_json = udev_output_to_json(udev_output);

    var pnpId;
    if (as_json.DEVLINKS) {
      pnpId = as_json.DEVLINKS.split(' ')[0];
      pnpId = pnpId.substring(pnpId.lastIndexOf('/') + 1);
    }
    var port = {
      comName: as_json.DEVNAME,
      comPath: as_json.DEVPATH,
      manufacturer: as_json.ID_VENDOR,
      serialNumber: as_json.ID_SERIAL,
      pnpId: pnpId,
      vendorId: '0x' + as_json.ID_VENDOR_ID,
      productId: '0x' + as_json.ID_MODEL_ID
    };

    callback(null, port);
  }

  exec('/sbin/udevadm info --query=property -p $(/sbin/udevadm info -q path -n ' + path + ')', function (err, stdout) {
    if (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
      return;
    }

    udev_parser(stdout, callback);
  });
}

function list(callback) {


  //var dirName = (spfOptions.queryPortsByPath ? '/dev/serial/by-path' : '/dev/serial/by-id');
  var dirName = '/dev';

  fs.readdir(dirName, function (err, files) {
    if (err) {
      // if this directory is not found this could just be because it's not plugged in
      if (err.errno === 34) {
        return callback(null, []);
      }

      if (callback) {
        callback(err);
      } else {
        throw err;
      }
      return;
    }

    //get only serial port  names
    for (var i = files.length - 1; i >= 0; i--) {
      if ((files[i].indexOf('ttyS') === -1 && files[i].indexOf('ttyACM') === -1 && files[i].indexOf('ttyUSB') === -1 && files[i].indexOf('ttyAMA') === -1) || !fs.statSync(path.join(dirName, files[i])).isCharacterDevice()) {
        files.splice(i, 1);
      }
    }

    async.map(files, function (file, callback) {
      portify(path.join(dirName, file), callback);
    }, callback);
  });
}

exports.list = list;
