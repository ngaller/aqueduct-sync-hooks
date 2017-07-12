// Import Tinytest from the tinytest Meteor package.
import { expect } from "meteor/practicalmeteor:chai";

// Import and rename a variable exported by aqueduct-sync-hooks.js.
import addSyncHooks from "meteor/nicocrm:aqueduct-sync-hooks";

describe('aqueduct-sync-hooks', function() {
  it('should export a function', function() {
    expect(addSyncHooks).to.be.a('function')
  })
})
