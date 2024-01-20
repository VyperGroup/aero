# Common misconceptions

- Server-only: When I say this I am usually referring to running the SW code in the web server instead.
- Backend: The code that the _user_ doesn't see. Usually this refers to using different implementations of the same thing. For example, you may refer to a bare server as a bare backend. This is because there are varying implementations to the standard, however bare is not a backend proxy server, it is the _bare_ proxy itself.
- Let proxify refer to the action of making a browser feature work on the proxy and use proxy as a verb for the gerund of the actual network request proxying.
- Don't confuse web proxies with HTTP proxies. Web proxies give you control over the sandboxing and don't require any configuration. If you try using a HTTP proxy over aero the data won't go through that proxy. It's like how using VPNs behind TOR is breaks security. You need to setup the HTTP proxy on the bare server itself, preferrably through a custom implementation.
