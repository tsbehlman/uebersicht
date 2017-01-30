'use strict';

const fs = require('fs');

function addWidget(id, filePath, emit) {
  WidgetBundle(id, filePath, (widget) => {
    emit({type: 'added', widget: widget});
  });
}

function removeWidget(id, filePath, emit) {
  emit({type: 'removed', id: id});
}

function WidgetBundle(id, filePath, callback) {
  fs.readFile(filePath, (error, data) => {
    const widget = {
      id: id,
      filePath: filePath,
      error: undefined,
      body: undefined
    };
    
    if(error !== null) {
      widget.error = error.message ? error.message : String(error);
    }
    else {
      widget.body = "(function(){return {" + data + "}})();";
    }
    
    callback(widget);
  });
}

module.exports = function WidgetBundler() {
  const api = {};

  api.push = function push(action, callback) {
    if (action && action.type) {
      action.type === 'added'
        ? addWidget(action.id, action.filePath, callback)
        : removeWidget(action.id, action.filePath, callback)
        ;
    }
  };

  api.close = function close() {
    
  };

  return api;
};
