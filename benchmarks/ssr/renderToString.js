'use strict'

const Blu = require('../../dist/blu.common.js')
const createRenderer = require('../../packages/blu-server-renderer').createRenderer
const renderToString = createRenderer().renderToString
const gridComponent = require('./common.js')

console.log('--- renderToString --- ')
const self = (global || root)
self.s = self.performance.now()

renderToString(new Blu(gridComponent), () => {
  console.log('Complete time: ' + (self.performance.now() - self.s).toFixed(2) + 'ms')
  console.log()
})
