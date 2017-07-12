Package.describe({
  name: 'nicocrm:aqueduct-sync-hooks',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Used to add hooks to the meteor collections, for Aqueduct Sync.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/nicocrm/aqueduct-sync-hooks',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({'aqueduct-pipe-joints': '1.0.4'})

Package.onUse(function(api) {
  api.versionsFrom('1.5');
  api.use('ecmascript');
  api.mainModule('index.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('practicalmeteor:mocha');
  api.use('nicocrm:aqueduct-sync-hooks');
  api.mainModule('aqueduct-sync-hooks-tests.js');
});
