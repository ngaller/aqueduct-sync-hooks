import {MongoInternals} from 'meteor/mongo'
import {buildQueue, getLocalConnection} from 'aqueduct-sync-mongo'
const addSyncHooks = require('./addSyncHooks')
const addJointHooks = require('./addJointHooks')

/**
 * create sync and joint hooks for the specified pipes
 * @param pipes Pipes configuration
 * @param meteorCollections  Meteor collections
 * @param queueName Name of collection to use as queue
 */
module.exports = function (pipes, meteorCollections, queueName) {
  const db = MongoInternals.defaultRemoteCollectionDriver().mongo.db
  return getLocalConnection(db, pipes).then(localConnection => {
    return buildQueue(db, queueName).then(queue => {
      for (let p of pipes) {
        if (!meteorCollections[p.local])
          throw new Error('Invalid local collection name ' + p.local)
        const keyField = localConnection[p.local].getKeyField()
        addSyncHooks(meteorCollections[p.local], keyField, p.local, queue, err => {
          console.warn(`Error in sync hook for ${p.local}`, err.message || err.toString())
        })
        if (p.joints) {
          for (let j of p.joints) {
            if (!meteorCollections[j.parentEntity])
              throw new Error(`Invalid parentEntity ${j.parentEntity} in joint of ${p.local}`)
            addJointHooks(meteorCollections[p.local], meteorCollections[j.parentEntity], {
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
