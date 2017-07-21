const jointBuilder = require('aqueduct-pipe-joints/local')

// add hooks to maintain the joints between collections when records are updated
// (this only deals with the related list, because the parent association is already
// being populated via a lookup that includes the fields we want to have from the
// parent)
module.exports = function addJointHooks(childCollection, parentCollection, jointConfig) {
  const joint = jointBuilder(jointConfig)
  const addHook = (hook, handler) => {
    if (handler)
      hook((userId, doc) => handler(doc))
  }
  addHook(childCollection.after.insert, joint.onChildInserted)
  addHook(childCollection.after.update, joint.onChildUpdated)
  addHook(childCollection.after.remove, joint.onChildRemoved)
}
