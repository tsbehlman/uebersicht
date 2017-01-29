'use strict';

const fs = require('fs');

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

  function addWidget(id, filePath, emit) {
    WidgetBundle(id, filePath, (widget) => {
      emit({type: 'added', widget: widget});
    });
  }
  
  function removeWidget(id, filePath, emit) {
    emit({type: 'removed', id: id});
  }

  function WidgetBundle(id, filePath, callback) {
    const widget = {
      id: id,
      filePath: filePath,
      body: "(function(){return {" + fs.readFileSync(filePath) + "}})();"
    };
    
    callback(widget);
  }

  return api;
};
