'use strict';

const runShellCommand = require('./runShellCommand');

module.exports = function runCommand(widget, callback) {
  const command = widget.command;

  if (typeof command === 'function') {
    command.apply(widget, [callback]);
  } else if (typeof command === 'string') {
    runShellCommand(command, callback);
  } else {
    callback();
  }
};
