'use strict'

import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

function createWindow () {
  const win = new BrowserWindow({
    width: 400,
    height: 800
  })

  win.loadURL('http://www.baidu.com')
}

app.on('ready', createWindow)
