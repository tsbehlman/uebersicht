var Widget = require('./ClassicWidget.coffee');
var rendered = new Map();

function isVisibleOnScreen(widgetId, screenId, state) {
  var settings = state.settings[widgetId] || {};
  var isVisible = false;

  if (settings.hidden) {
    isVisible = false;
  } else if (settings.showOnAllScreens ||
             settings.showOnAllScreens === undefined) {
    isVisible = true;
  } else if (settings.showOnMainScreen) {
    isVisible = state.screens.indexOf(screenId) === 0;
  } else if (settings.showOnSelectedScreens) {
    isVisible = (settings.screens || []).indexOf(screenId) !== -1;
  }

  return isVisible;
}

function renderWidget(widget, domEl) {
  var prevRendered = rendered.get(widget.id);

  if (prevRendered && prevRendered.widget === widget) {
    return;
  } else if (prevRendered) {
    prevRendered.instance.update(widget);
  } else {
    var instance = Widget(widget);
    domEl.appendChild(instance.create());
    rendered.set(widget.id, {
      instance: instance,
      widget: widget,
    });
  }
}

function destroyWidget(widget, id) {
  widget.instance.destroy();
  rendered.delete(id);
}

module.exports = function render(state, screen, domEl) {
  let remaining = new Map(rendered);
  let widgets = Object.keys(state.widgets);

  for (let id of widgets) {
    var widget = state.widgets[id];
    if (!isVisibleOnScreen(id, screen, state)) {
      continue;
    }

    if (widget.error) {
      console.error(widget.error);
    } else {
      renderWidget(widget, domEl);
    }

    remaining.delete(widget.id);
  }

  remaining.forEach(function(value, key, map) {
    destroyWidget(value, key);
  });
};
