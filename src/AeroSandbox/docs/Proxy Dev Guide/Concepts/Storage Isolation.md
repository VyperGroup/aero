# Storage Isolation

TODO: Escaping is a key part of Storage Isolation

TODO: This is a stub...

TODO: Figure out where my localStorage API interceptors went. Somewhere along the line I lost them.

## Storage Limit Extending through Storage Wrapping

When storing in other storage APIs, the best thing you can do is add an identifier to your prefix that tells you that you are storing the key for another storage API so that you can look for keys. When you call the storage API, it should look through all the other storage APIs in which you have ways to store the data in. Artificially increasing the storage limit is difficult because you must carefully allocate where you store the wrapped-around data.

I recommend wrapping around these APIs in this order:

1. **WebSQL** - Mozilla removed WebSQL from Firefox, but it is still in Chrome. The reason why this could be advantageous as your primary fallback option to wrap around it is because very few sites would ever think about using WebSQL in production
2. **IndexedDB** - Large storage capacities are supported
3. **LocalStorage** - LocalStorage has the lowest storage limit, so I recommend using it only if necessary. The k/v design of LocalStorage also makes it challenging to store entries from other storage types.
4. **File System API** - This only makes sense if your user grants your site access to storage persistency, which needs to happen, and your site is approved for persistent storage by Firefox if you are using it. You would also have to use a database library which can store these files.

TODO: Show the storage limit comparison for each browser

#### How to calculate the size taken up by a storage API

TODO: This is a stub...

### Optimizations

In your sandboxing code for the storage APIs, you should make keys called `using_<other storage library>` and with its values being initialized to false. Every time a storage API is called for a new key and a value gets added, you need to write code to calculate the amount of storage left in the storage API. When you are over the limit, you set `using_<the other storage library>` to true, then store the content in that other storage library.

## Max storage allocated per proxy origin

It would be best if you made it so that you don't let the sites you are proxying abuse your storage resources. You can solve this by restricting the amount of data a specific proxy origin can store. Make this available as a config option in your proxy.
