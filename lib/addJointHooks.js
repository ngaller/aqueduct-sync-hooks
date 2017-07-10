const jointBuilder = require('aqueduct-pipe-joints')

module.exports = function addJointHooks(childCollection, parentCollection, jointConfig) {
  const joint = jointBuilder({childCollection, parentCollection, ...jointConfig})
  const addHook = (hook, handler) => {
    if(handler)
      hook((userId, doc) => handler(doc))
  }
  addHook(parentCollection.after.insert, joint.onParentInserted)
  addHook(parentCollection.after.update, joint.onParentUpdated)
  addHook(childCollection.after.insert, joint.onChildInserted)
  addHook(childCollection.after.update, joint.onChildUpdated)
  addHook(childCollection.after.remove, joint.onChildRemoved)
}
