/**
 * Created by taoyuan on 15/12/7.
 */

"use strict";

var _ = require('lodash');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var watch = require('watch');

exports.Watcher = Watcher;

function is_tty(f, stat) {
  return f.indexOf('tty') > 0;
}

function Watcher(root, options) {
  if (!(this instanceof Watcher)) {
    return new Watcher(root, options);
  }

  var that = this;

  this._ready = false;

  watch.createMonitor(root, {filter: is_tty}, function (monitor) {
    that.monitor = monitor;

    monitor.on("created", function (f, stat) {
      that.emit('created', f, stat);
    });

    monitor.on("changed", function (f, curr, prev) {
      that.emit('changed', f, curr, prev);
    });

    monitor.on("removed", function (f, stat) {
      that.emit('removed', f, stat);
    });

    that._emitReady();

  });
}

util.inherits(Watcher, EventEmitter);

Object.defineProperty(Watcher.prototype, 'files', {
  get: function () {
    return this.monitor && this.monitor.files;
  }
});

Watcher.prototype._emitReady = function () {
  if (this._ready) return;

  this._ready = true;
  this.emit('ready');

  var that = this;
  _.forEach(this.monitor.files, function (stat, f) {
    that.emit('created', f, stat);
  });
};

Watcher.prototype.isReady = function () {
  return this._ready;
};

Watcher.prototype.stop = function () {
  if (!this._ready) return;
  this.monitor.stop();
};

