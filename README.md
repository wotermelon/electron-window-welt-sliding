# electron-window-welt-sliding

An electron window welt sliding plugin.

![screenshot](./screenshot.gif)

## Installation

### npm

```BASH
npm install electron-window-welt-sliding --save
```

### yarn

```bash
yarn add electron-window-welt-sliding
```

## Usage

```javascript
const weltSliding = require('electron-window-welt-sliding')
// win is your BrowserWindow instance.
// It return this so you can chain calls.
weltSliding(win).setSpeed(500).destroy()
```

### methods:

| methodName | params | return | default |Descrition |
| ---- | ---- | ---- | ---- | ---- |
| `setWindow` | `BrowserWindow` | `this` |  | set the window which to welt sliding. |
| `setSpeed` | `Number` | `this` | 500 | set the animate duration. |
| `setHideTimeout` | `Number` | `this` | 300 | set delay before sliding hidden. |
| `disableSlide` | | `this` | | disable welt sliding. |
| `enableSlide` | | `this` | | enable welt sliding. |
| `destroy` | | | | destroy welt sliding. |