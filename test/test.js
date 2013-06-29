/**
 * Module dependencies
 */

var should = require('should')
  , plugin = require('..');

describe('consulate-simple-valid-redirect-uri', function() {
  var isValidClientRedirectURI, app;

  beforeEach(function() {
    app = {
      isValidClientRedirectURI: function(cb) {
        isValidClientRedirectURI = cb;
      }
    };
  });

  it('should pass a valid uri', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'http://localhost:5000'
    };

    isValidClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
      if (err) return done(err);
      result.should.eql(true);
      done();
    });
  });

  it('should pass a valid uri with a different sub-path', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'http://localhost:5000'
    };

    isValidClientRedirectURI(client, 'http://localhost:5000/my/callback', function(err, result) {
      if (err) return done(err);
      result.should.eql(true);
      done();
    });
  });

  it('should pass a wildcarded client_uri', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'http://*.example.com'
    };

    isValidClientRedirectURI(client, 'http://testing.123.example.com', function(err, result) {
      if (err) return done(err);
      result.should.eql(true);
      done();
    });
  });

  it('should pass a wildcarded client_uri with some things before', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'http://test.*.example.com'
    };

    isValidClientRedirectURI(client, 'http://test.crazy.stuff.example.com', function(err, result) {
      if (err) return done(err);
      result.should.eql(true);
      done();
    });
  });

  it('should pass a preserve a "*" in the client redirect_uri path', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'http://example.com/test/*/123'
    };

    isValidClientRedirectURI(client, 'http://example.com/test/*/123', function(err, result) {
      if (err) return done(err);
      result.should.eql(true);
      done();
    });
  });

  it('should pass a valid uri list', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: [
        'http://localhost:5000',
        'https://example.com',
        'http://localhost:3000'
      ]
    };

    isValidClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
      if (err) return done(err);
      result.should.eql(true);
      done();
    });
  });

  it('should fail a redirect_uri with an invalid sub-path', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'http://localhost:5000/my/callback'
    };

    isValidClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
      if (err) return done(err);
      result.should.eql(false);
      done();
    });
  });

  it('should fail a wildcarded client_uri that doesn\'t match', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'http://*.example.com'
    };

    isValidClientRedirectURI(client, 'http://example.com', function(err, result) {
      if (err) return done(err);
      result.should.eql(false);
      done();
    });
  });

  it('should fail a mismatched protocol', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'https://localhost:5000'
    };

    isValidClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
      if (err) return done(err);
      result.should.eql(false);
      done();
    });
  });

  it('should fail a mismatched host', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'http://example.com'
    };

    isValidClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
      if (err) return done(err);
      result.should.eql(false);
      done();
    });
  });
});
