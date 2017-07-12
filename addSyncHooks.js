module.exports = function addSyncHooks(collection, type, queue, onError) {
  collection.after.insert(function(userId, doc) {
    console.log('Got an insert', doc)
    queue.add({
      type: type, data: doc, identifier: this._id, action: 'create'
    }).catch(onError)
  })
  collection.after.update(function(userId, doc, fieldNames, modifier) {
    if(modifier.$set) {
      queue.add({
        type: type, data: modifier.$set, identifier: doc._id, action: 'update'
      }).catch(onError)
    }
  })
  collection.after.remove(function(userId, doc) {
    queue.add({
      type: type, data: doc, action: 'delete'
    }).catch(onError)
  })
}
