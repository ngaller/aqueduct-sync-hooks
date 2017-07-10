const addSyncHooks = require('./addSyncHook')
const addJointHooks = require('./addJointHook')

// create sync and joint hooks for the specified pipes
module.exports = function(pipes, collections, queue) {
  for(let p of pipes) {
    if(!collections[p.local])
      throw new Error('Invalid local collection name ' + p.local)
    addSyncHooks(collections[p.local], p.local, queue, err => {
      console.warn(`Error in sync hook for ${p.local}`, err.message || err.toString())
    })
    if(p.joints) {
      for(let j of p.joints) {
        if(!collections[j.parentEntity])
          throw new Error(`Invalid parentEntity ${j.parentEntity} in joint of ${p.local}`)
        addJointHooks(collections[p.local], collections[j.parentEntity], j)
      }
    }
  }
}
