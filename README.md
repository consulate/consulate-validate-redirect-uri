consulate-validate-redirect-uri [![Build Status](https://travis-ci.org/consulate/consulate-validate-redirect-uri.png?branch=master)](https://travis-ci.org/consulate/consulate-validate-redirect-uri)
===================================

Simple, secure redirect-uri check with wildcard support for [consulate](https://github.com/consulate/consulate)

Usage
-----

Just register `consulate-validate-redirect-uri` as a plugin with your [consulate](https://github.com/consulate/consulate) server:

```js
var consulate = require('consulate')
  , uriCheck = require('consulate-validate-redirect-uri');

var app = consulate();

app.plugin(uriCheck());
```

The plugin will check `client.redirect_uri` and try to match it against the `redirect_uri` for the request. It can be either a string or an array:

### string

```js
var client = {
  redirect_uri: 'https://example.com'
};
```

### array

```js
var client = {
  redirect_uri: [
    'https://example.com',
    'https://otherdomain.com'
  ]
};
```

### wildcard

If wildcard support is needed just use a `*`:

```js
var client = {
  redirect_uri: 'https://*.example.com'
};

var redirect_uri1 = 'https://test.example.com'; // will be matched
var redirect_uri2 = 'https://example.com'; // will not be matched
```

### subpath

Any paths on the `redirect_uri` that match the registered `client.redirect_uri` will be matched as well:

```js
var client = {
  redirect_uri: 'https://example.com/test'
};

var redirect_uri1 = 'https://example.com/test/1/2/3'; // will be matched
var redirect_uri2 = 'https://example.com/other/path/4/5/6'; // will not be matched
```

Tests
-----

```sh
$ npm test
```
