import {MongoInternals} from 'meteor/mongo'
import {buildQueue, getLocalConnection} from 'aqueduct-sync-mongo'
const addSyncHooks = require('./addSyncHooks')
const addJointHooks = require('./addJointHooks')

/**
 * create sync and joint hooks for the specified pipes
 * @param pipes Pipes configuration
 * @param localCollections  Meteor collections
 * @param queueName Name of collection to use as queue
 */
module.exports = function (pipes, localCollections, queueName) {
  console.log('In addSyncHooks');
  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db
  return getLocalConnection(db, pipes).then(localConnection => {
    return buildQueue(db, queueName).then(queue => {
      for (let p of pipes) {
        if (!localCollections[p.local])
          throw new Error('Invalid local collection name ' + p.local)
        addSyncHooks(localCollections[p.local], p.local, queue, err => {
          console.warn(`Error in sync hook for ${p.local}`, err.message || err.toString())
        })
        if (p.joints) {
          for (let j of p.joints) {
            if (!localCollections[j.parentEntity])
              throw new Error(`Invalid parentEntity ${j.parentEntity} in joint of ${p.local}`)
            console.log(isCollection(localConnection[p.local]))
            addJointHooks(localCollections[p.local], localCollections[j.parentEntity], {
              childCollection: localConnection[p.local],
              parentCollection: localConnection[j.parentEntity],
              childEntity: p.local,
              ...j
            })
          }
        }
      }
    })
  })
}
function isCollection(collection) {
  console.log(typeof collection === 'object')
  console.log( 'get', !!collection.get)
console.log('find',    !!collection.find)
console.log('update',    !!collection.update)
console.log( 'adudsr',   !!collection.addOrUpdateChildInCollection)
console.log(   'remove', !!collection.removeChildFromCollection)
}
