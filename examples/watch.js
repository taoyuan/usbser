/**
 * Created by taoyuan on 15/12/7.
 */

"use strict";

var watch = require('watch');
watch.createMonitor('/dev', function (monitor) {
  monitor.on("created", function (f, stat) {
    console.log('created', f);
  });
  monitor.on("changed", function (f, curr, prev) {
    // Handle file changes
  });
  monitor.on("removed", function (f, stat) {
    console.log('removed', f);
  });
});
