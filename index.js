/**
 * Module dependencies
 */

var debug = require('simple-debug')('consulate-validate-redirect-uri')
  , parse = require('url').parse;

/**
 * Defines
 */

var WILDCARD = '___wildcard___';

/**
 * isValidClientRedirectURI plugin
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function(options) {
  options = options || {};

  var match = options.match || fuzzyMatch;

  return function(app) {
    app.isValidClientRedirectURI(function(client, redirect_uri, done) {
      var uriList = client.redirect_uri || client.redirect_uris;

      var client_uris = Array.isArray(uriList)
        ? uriList
        : [uriList];

      for (var i = client_uris.length - 1; i >= 0; i--) {
        if (match(client_uris[i], redirect_uri)) return done(null, true);
      };

      done(null, false);
    });
  };
};

/**
 * Fuzzy match a redirect_uri against a client_uri
 *
 * @param {String} client_uri
 * @param {String} redirect_uri
 * @return {Boolean}
 * @api private
 */

function fuzzyMatch(client_uri, redirect_uri) {
  debug('testing match "%s" against "%s"', client_uri, redirect_uri);

  // It's an exact match
  if (client_uri === redirect_uri) return true;

  // The node url.parse doesn't allow '*' in a hostname so we'll have to bypass it
  client_uri = client_uri.replace('*', WILDCARD);

  var cinfo = parse(client_uri)
    , rinfo = parse(redirect_uri);

  // Put the '*' back
  var pathname = cinfo.pathname.replace(WILDCARD, '*')
    , host = cinfo.host.replace(WILDCARD, '.*?');

  // Build a regex for the hostname
  var hostre = new RegExp('^' + host + '$');

  // Fuzzy match the url info
  return cinfo.protocol === rinfo.protocol
    && hostre.test(rinfo.host)
    && rinfo.pathname.indexOf(pathname) === 0;
};
