try {
  var bluVersion = require('blu').version
} catch (e) {}

var packageName = require('./package.json').name
var packageVersion = require('./package.json').version
if (bluVersion && bluVersion !== packageVersion) {
  throw new Error(
    '\n\nBlu packages version mismatch:\n\n' +
    '- blu@' + bluVersion + '\n' +
    '- ' + packageName + '@' + packageVersion + '\n\n' +
    'This may cause things to work incorrectly. Make sure to use the same version for both.\n'
  )
}

module.exports = require('./build')
