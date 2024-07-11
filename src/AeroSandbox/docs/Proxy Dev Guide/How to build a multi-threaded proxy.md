# How to build a multi-threaded SW proxy

## By using a Service Worker, you already have a multi-threaded proxy

The JS runs off the main thread whenever you create a new Worker. This leads to performance benefits. If you remember from earlier, one of the reasons why we use Service Workers, other than more catch-all (easier) interception, is because it offloads the rewriting of the network requests to a separate thread.

## Before you continue reading the below subheadings

It would help to learn what a [SharedWorker is](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) and what it is for.

## bare-mux 2.0

I've already explained why you should use bare-mux. One of the most commonly used things in proxy is the client used to send requests to be proxied. In a SW proxy, the Service Worker uses it when it intercepts the fetch event, and your client-side JS injects probably use it to proxy the WS because the fetch event doesn't have events for WS. If you use bare-mux 2.0, you can initialize the same client in both the SW and the client-side JS injects, and as a result, it would do the proxying magic in another thread. Before version 2.0, bare-mux never ran in a SharedWorker, so you should update it if you are on old versions.

## One of the best optimizations you can make to your proxy (SharedWorker-based rewriting)

A significant slow-down in proxies is that you need to initialize your rewriters when you initialize SW, and inside the client side, JS injects each time you load another site in your proxy. It doesn't matter too much for the SW itself because it is registered and loaded once until it updates, but it does matter more for the client-side JS. This is made especially worse if the rewriters you are initalizing use parsers that have to fetched and loaded each time.

The solution to this is running your rewriters inside of a Shared Worker. You might realize that you need to create a promise and wait for the messages to return. You don't want to block the main thread and wait for your asynchronous code to finish and the promise to be fulfilled. The solution is to use a library to get messages from the SharedWorker in a non-blocking manner, such as [coincident](https://github.com/WebReflection/coincident) by WebReflection. When porting your rewriters to run in a SharedWorker, make your rewriter functions and classes merely interfaces that send messages behind the scenes to ask your rewriter to write your source code and get a response back. In addition, make the message content you send to the rewriter SharedWorker an object with properties for the type of the rewriter as an enum value and the string content of the body you want to rewrite.

> Shoutout to WebReflection! Every proxy developer should learn to respect WebReflection; his projects align well with web sandboxing and proxy development. He is a goated dev.

Adding this optimization to your SW proxy would help the SW load times and the sites' tabs being proxied. You don't need a SW-powered proxy to take advantage of this optimization. If you have a server-only proxy, you still load rewriters into your client-side JS injects.

### Notes when implementing

- One catch is that you must have initiated the rewriters before the SW commenced. You need to register the Worker in the same script bundle that you use to register the SW before you register the SW.
- Make this a configurable option and not have to force rewriter SharedWorkers

## Closing words

If you do all the optimizations described above, you can have your proxy run in four threads, which would be very epyc (pun intended) :). It is important to note that there is a limit to how many Workers you can create, as shown here.
