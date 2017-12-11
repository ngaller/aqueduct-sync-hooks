import {MongoInternals} from 'meteor/mongo'
// const mongodb = MongoInternals.NpmModules.mongodb.module

// remove _id property
const cleanId = doc => {
  const c = {...doc}
  delete c._id
  return c
}

const cleanDottedProperties = doc => {
  return Object.keys(doc).reduce((acc, k) =>
    k.indexOf('.') < 0 ? Object.assign(acc, { [k]: doc[k] }) : acc, {})
}

// transform Meteor MongoID into a real mongo id atom
// (this is disabled right now... we just use string as _id)
// const getMongoId = id => new mongodb.ObjectID(id.toHexString())
const getMongoId = id => id

// add hooks to generate messages in the MongoDB queue when records are modified locally
module.exports = function addSyncHooks(collection, keyField, type, queue, onError) {
  collection.after.insert(function(userId, doc) {
    queue.add({
      type: type,
      data: JSON.stringify(cleanId(doc)),
      identifier: getMongoId(doc._id),
      action: 'create'
    }).catch(onError)
  })
  collection.after.update(function(userId, doc, fieldNames, modifier) {
    if(modifier.$set) {
      const updateDocument = cleanDottedProperties(cleanId(modifier.$set))
      if(Object.keys(updateDocument).length === 0) {
        // an empty update (they are probably just making updates to the sub properties)
        return
      }
      queue.add({
        type: type,
        data: JSON.stringify({
          ...updateDocument,
          [keyField]: doc[keyField]
        }),
        identifier: getMongoId(doc._id),
        action: 'update'
      }).catch(onError)
    }
  })
  collection.after.remove(function(userId, doc) {
    queue.add({
      type: type, data: cleanDocument(doc), action: 'delete'
    }).catch(onError)
  })
}
