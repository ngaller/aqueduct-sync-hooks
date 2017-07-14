Package.describe({
  name: 'nicocrm:aqueduct-sync-hooks',
  version: '0.0.8',
  // Brief, one-line summary of the package.
  summary: 'Used to add hooks to the meteor collections, for Aqueduct Sync.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/nicocrm/aqueduct-sync-hooks',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'aqueduct-pipe-joints': '1.0.11',
  'aqueduct-sync-mongo': '1.0.7'
})

Package.onUse(function(api) {
  api.versionsFrom('1.5');
  // having some issues with more recent versions, fix to this version for now
  api.use('matb33:collection-hooks@0.8.4');
  api.use('ecmascript');
  api.mainModule('index.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('practicalmeteor:mocha');
  api.use('nicocrm:aqueduct-sync-hooks');
  api.mainModule('aqueduct-sync-hooks-tests.js', 'server');
});
