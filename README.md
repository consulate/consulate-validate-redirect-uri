consulate-simple-valid-redirect-uri [![Build Status](https://travis-ci.org/consulate/consulate-simple-valid-redirect-uri.png?branch=master)](https://travis-ci.org/consulate/consulate-simple-valid-redirect-uri)
===================================

Simple, secure redirect-uri check with wildcard support for [consulate](https://github.com/consulate/consulate)

Usage
-----

Just register `consulate-simple-valid-redirect-uri` as a plugin with your [consulate](https://github.com/consulate/consulate) server:

```js
var consulate = require('consulate')
  , uriCheck = require('consulate-simple-valid-redirect-uri');

var app = consulate();

app.plugin(uriCheck());
```

Tests
-----

```sh
$ npm test
```
