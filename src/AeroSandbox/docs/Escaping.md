# Escaping (concept)

> This is a stub

Escaping is where you prefix a value, so only a certain thing can use it. API interceptors must be implemented to remove this added indentifier, so the site suspects nothing wrong. Escaping is usually done in proxies with the proxy origin and then a character to indicate that URL is finished and the rest after that is the original data. This should be a character that can't be listed in a URL [as per RFC 3986](https:/www.rfc-editor.org/rfc/rfc3986#section-2) (`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=`).

## Messages

In this case the key is the channel, if it exists, or instead the message data object but with the proxy origin attached to it as a property with the original data as a property in this object. In the case of messages, the message listener can't be invoked at all.

## Storage

This is simply involves escaping the directory names (in the Filesystem API exclusively) or the the store names.
