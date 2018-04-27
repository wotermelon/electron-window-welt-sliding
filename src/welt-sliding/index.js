const mouse = require('win-mouse')()

class WeltSlide {
  /**
   * @param {Object} options
   * {
   *    win: '',  // 窗口
   *    speed: 500,  // 动画过渡时间
   *    hideTimeout: 300  // 延时隐藏窗口的时间
   * }
   */
  constructor (options = {}) {
    if (process.platform !== 'win32') return
    const defaultOptions = {
      win: null,
      speed: 500,
      hideTimeout: 300
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.win = this.options.win
    this.enableHide = true
    this.isAnimating = false
    this.isHidden = false
    this.isWaitingToHide = false
    this.init()
  }
  /**
   * 初始化
   */
  init () {
    mouse.on('move', (x, y) => {
      if (!this.enableHide || !this.win) return
      // 如果是窗口聚焦状态，则显示->隐藏
      const winSize = this.win.getSize()
      const winPos = this.win.getPosition()
      if (this.isAnimating) return
      // 窗口显示的话，两种情况
      // 一种是还没有等待隐藏，另一种正在setTimeout等待隐藏
      if (!this.isHidden) {
        const mouseOutWin = this.isOutOfWindow(winSize, winPos, { x, y })
        // 正在等待隐藏窗口
        if (this.isWaitingToHide) {
          // 鼠标在窗口内，则取消隐藏
          if (!mouseOutWin) {
            this.isWaitingToHide = false
          }
        } else {
          // 没有等待隐藏窗口
          // 判断窗口是否贴顶部并且鼠标不在窗口区域决定是否隐藏
          if (winPos[1] <= 0 && mouseOutWin) {
            this.isWaitingToHide = true
            this.win.setAlwaysOnTop(true)
            setTimeout(() => {
              // 已经取消隐藏
              if (!this.isWaitingToHide) return
              this.isAnimating = true
              this.animate(winPos[1], -winSize[1], (offsetY) => {
                this.win.setPosition(winPos[0], offsetY)
              }).then(() => {
                this.isAnimating = false
                this.isHidden = true
                this.isWaitingToHide = false
                this.win.setAlwaysOnTop(false)
              }).catch((err) => {
                console.log(err)
              })
            }, this.options.hideTimeout)
          }
        }
      } else {
        // 如果不是聚焦装药，则隐藏->显示
        if (y <= 0 &&
          (x >= winPos[0] || x <= winPos[0] + winSize[0])) {
          this.win.setAlwaysOnTop(true)
          this.isAnimating = true
          this.animate(winPos[1], 0, (offsetY) => {
            this.win.setPosition(winPos[0], offsetY)
          }).then(() => {
            this.isAnimating = false
            this.isHidden = false
            this.win.setAlwaysOnTop(false)
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    })
  }
  /**
   * 移除监听
   */
  destroy () {
    mouse.removeAllListeners()
  }
  /**
   * 设置窗口对象
   * @param {BrowserWindow} win
   */
  setWindow (win) {
    this.options.win = win
    this.win = win
    return this
  }
  /**
   * 设置窗口对象
   * @param {BrowserWindow} win
   */
  setHideTimeout (timeout) {
    if (!this.isNumber(timeout)) {
      throw new Error('Timeout not a legal number.')
    } else {
      this.options.hideTimeout = timeout
    }
    return this
  }
  /**
   * 设置动画时间
   * @param {Number} speed 动画持续时间
   */
  setSpeed (speed) {
    if (!this.isNumber(speed)) {
      throw new Error('Speed not a legal number.')
    } else {
      this.options.speed = speed
    }
    return this
  }
  isNumber (val) {
    return typeof val === 'number' && val >= 0
  }
  /**
   * 禁止隐藏
   */
  disableSlide () {
    this.enableHide = false
    return this
  }
  /**
   * 允许隐藏
   */
  enableSlide () {
    this.enableHide = true
    return this
  }
  /**
   * 鼠标是否在窗口上
   * @param {Array} winSize 窗口的尺寸，[width, height]
   * @param {Array} winPos 窗口的绝对坐标，[x, y]
   * @param {Object} { x, y } 鼠标的绝对坐标
   */
  isOutOfWindow (winSize, winPos, { x, y }) {
    if (x > winPos[0] + winSize[0] ||
      x < winPos[0]) return true
    if (y > winPos[1] + winSize[1]) return true
  }
  cubicEaseOut (t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b
  }
  /**
   * 动画过渡函数
   * @param {Number} start 开始数值
   * @param {Number} end 结束数值
   * @param {Function} fn 每一步执行的函数
   * @return {Promise}
   */
  animate (start, end, fn) {
    // console.time('animate')
    return new Promise((resolve, reject) => {
      let timer = null
      let offset = end - start
      let t = 0
      let maxT = parseInt(this.options.speed / 16.6)
      timer = setInterval(() => {
        t++
        if (t >= maxT) {
          clearInterval(timer)
          // console.timeEnd('animate')
          resolve()
        }
        let offsetY = parseInt(this.cubicEaseOut(t, start, offset, maxT))
        /* eslint-disable no-compare-neg-zero */
        if (offsetY === -0) {
          offsetY = 0
        }
        fn && fn(offsetY)
      }, 16.6)
    })
  }
}

const weltSlide = new WeltSlide()

module.exports = function (win) {
  return weltSlide.setWindow(win)
}
