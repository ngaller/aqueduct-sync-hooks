Used to add hooks to the meteor collections.

 * addSyncHooks(collections, pipes, queue)
    - this will add after update, insert, delete hooks on each collection referenced by pipe to send a corresponding message to the queue
    - it will create joint for each joint configuration in the pipe, and add the corresponding hooks on the local collection to have the joint carry out the local update
