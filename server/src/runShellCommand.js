module.exports = function runShellCommand(command, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/run/', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 400) {
        callback(null, xhr.responseText);
      }
      else {
        callback(xhr.responseText || 'error running command', xhr.responseText);
      }
    } 
  };
  xhr.send(command);
};
