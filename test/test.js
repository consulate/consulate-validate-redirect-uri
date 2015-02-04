/**
 * Module dependencies
 */

var should = require('should')
  , plugin = require('..');

describe('consulate-validate-redirect-uri', function() {
  var verifyClientRedirectURI, app;

  beforeEach(function() {
    app = {
      verifyClientRedirectURI: function(cb) {
        verifyClientRedirectURI = cb;
      }
    };
  });

  it('should pass a valid uri', function(done) {
    plugin()(app);

    var client = {
      redirect_uri: 'http://localhost:5000'
    };

    verifyClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
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

    verifyClientRedirectURI(client, 'http://localhost:5000/my/callback', function(err, result) {
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

    verifyClientRedirectURI(client, 'http://testing.123.example.com', function(err, result) {
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

    verifyClientRedirectURI(client, 'http://test.crazy.stuff.example.com', function(err, result) {
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

    verifyClientRedirectURI(client, 'http://example.com/test/*/123', function(err, result) {
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

    verifyClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
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

    verifyClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
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

    verifyClientRedirectURI(client, 'http://example.com', function(err, result) {
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

    verifyClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
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

    verifyClientRedirectURI(client, 'http://localhost:5000', function(err, result) {
      if (err) return done(err);
      result.should.eql(false);
      done();
    });
  });
});
