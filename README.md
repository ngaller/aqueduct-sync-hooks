Used to add hooks to the meteor collections.

 * addSyncHooks(aqueductPipes, meteorCollections, queueName)
    - this will add after update, insert, delete hooks on each collection referenced by pipe to send a corresponding message to the queue
      - for the update hook, we use the $set modifier.  However sub property update (with property paths) are removed, and if this results in an empty update the message is not added.
    - it will create joint for each joint configuration in the pipe, and add the corresponding hooks on the local collection to have the joint carry out the local update

Example:

```
// Meteor collections
import * as collections from './collections'
// Aqueduct pipes - we only really need the "local" and "localKey" fields populated
import * as pipes from './pipes'

addSyncHooks(pipes, collections, 'ErpSyncQueue').then(() => {
    console.log('Sync Hooks created')
}, e => {
    console.warn('Error creating sync hooks', e)
})
```

**NOTE** the npm version of this package is out of date.
