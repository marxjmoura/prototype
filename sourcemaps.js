var Transform = require('stream').Transform;
var PluginError = require('plugin-error');

var PLUGIN_NAME = 'gulp-site-sourcemaps';

module.exports = function () {
  var transformStream = new Transform({ objectMode: true });

  transformStream._transform = function (file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file); // nothing to do
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
    }

    var contents = file.contents.toString(encoding);
    var sourceMap = contents.indexOf('//# sourceMappingURL=');

    if (sourceMap > -1) {
      contents = contents.slice(0, sourceMap);
    }

    file.contents = Buffer.from(contents, encoding);

    callback(null, file);
  };

  return transformStream;
};
