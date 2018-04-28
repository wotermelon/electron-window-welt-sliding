'use strict'

const { app, BrowserWindow } = require('electron')
// const weltSliding = require('./welt-sliding')
const weltSliding = require('../dist/electron-window-welt-sliding')

function createWindow () {
  let win = new BrowserWindow({
    width: 450,
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
