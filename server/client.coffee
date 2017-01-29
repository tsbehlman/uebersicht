reducer = require './src/reducer'
listenToRemote = require './src/listen'
sharedSocket = require './src/SharedSocket'
render = require './src/render'

store = null
contentEl = null
screenId = null

init = ->
  sharedSocket.open("ws://#{window.location.host}")
  screenId = Number(window.location.pathname.replace(/\//g, ''))
  contentEl = document.getElementById('__uebersicht')
  contentEl.innerHTML = ''

  # legacy
  window.uebersicht =
    makeBgSlice: (canvas) ->
      console.warn 'makeBgSlice has been deprecated. Please use CSS \
        backdrop-filter instead: \
        https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter'

  window.addEventListener 'contextmenu', (e) ->
    e.preventDefault()

  window.state = undefined

  getState (err, initialState) ->
    bail err, 10000 if err?
    window.state = initialState
    render(window.state, screenId, contentEl)
    
    listenToRemote (action) ->
      window.state = reducer(window.state, action);
      render(window.state, screenId, contentEl)

getState = (callback) ->
  xhr = new XMLHttpRequest();
  xhr.open 'GET', '/state/', true
  xhr.responseType = 'json'
  xhr.send()
  xhr.onreadystatechange = () ->
    if (xhr.readyState == 4)
       if (xhr.status >= 200 && xhr.status < 400)
          callback null, xhr.response
       else
          callback xhr.responseText, null

bail = (err, timeout = 0) ->
  console.log err if err?
  setTimeout ->
    window.location.reload(true)
  , timeout

window.onload = init
