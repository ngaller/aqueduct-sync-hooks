import {MongoInternals} from 'meteor/mongo'
const mongodb = MongoInternals.NpmModules.mongodb.module

const cleanId = doc => {
  const c = {...doc}
  delete c._id
  return c
}

const getMongoId = id => new mongodb.ObjectID(id.toHexString())

module.exports = function addSyncHooks(collection, type, queue, onError) {
  collection.after.insert(function(userId, doc) {
    queue.add({
      type: type, data: cleanId(doc), identifier: getMongoId(doc._id), action: 'create'
    }).catch(onError)
  })
  collection.after.update(function(userId, doc, fieldNames, modifier) {
    if(modifier.$set) {
      queue.add({
        type: type, data: modifier.$set, identifier: getMongoId(doc._id), action: 'update'
      }).catch(onError)
    }
  })
  collection.after.remove(function(userId, doc) {
    queue.add({
      type: type, data: doc, action: 'delete'
    }).catch(onError)
  })
}
