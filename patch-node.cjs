// Polyfill for Node.js < 20.19.0 / < 22.12.0 where util.styleText only accepted a single string format
const util = require('node:util');

if (util && typeof util.styleText === 'function') {
  const originalStyleText = util.styleText;
  util.styleText = function (format, text) {
    if (Array.isArray(format)) {
      return format.reduce((acc, f) => originalStyleText(f, acc), text);
    }
    return originalStyleText(format, text);
  };
}
