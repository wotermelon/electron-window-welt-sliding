'use strict'

const { app, BrowserWindow } = require('electron')
const weltSliding = require('./welt-sliding')

function createWindow () {
  let win = new BrowserWindow({
    width: 500,
    height: 800,
    maximizable: false,
    webPreferences: {
      devTools: true
    }
  })

  win.on('closed', () => {
    win = null
  })

  weltSliding(win)

  win.loadURL(`file://${__dirname}/index.html`)
}

app.on('ready', createWindow)
