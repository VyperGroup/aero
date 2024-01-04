# Alternative Bare Clients

These custom proxy fetch implementations implementing the same Bare Client API. The reason why I am deciding to writing code like this rather than just writing seperate proxy fetch apis internally for aero is because, writing them allows me to have all of aero's code be able to just be "swapped" into any proxy and be guarenteed compatiblity.

There are two types of alternative bare clients:

## Middleware

I am converting all of aero's Middleware code into just one WebPack minified bundle that can be imported, and with no work required you get yourself middleware support on any proxy!

I will port all of aero's middleware code into a single WebPack bundle that, It seems like nobody is adopting my Middleware API at the moment, and that isn't necessarily a bad thing they have different priorities from me. I do think it is unfortunate how all this Middleware I write is only restricted to one proxy. I would like to give anyone the choice to use whatever proxy they want. I am not like Apple with their "blue bubbles".

There is only one

## Domain Fronting

I've devised an idea that uses CDN's to "proxy", some require hosting. I also found a way with to With these you can host your proxy with free to really cheap. I found that the EFF happens to [publically list and document many CDNs](https://atlas.eff.org/domains/googleusercontent.com.html). This is similar to [TOR's Meeks bridges](https://gitlab.torproject.org/legacy/trac/-/wikis/doc/meek#Webservices), but not inspired by it. [For more information](https://www.usenix.org/system/files/sec21-wei.pdf).

> All of the Domain Fronting proxy fetch implementations will extend the Middleware Bare Client

### Exploits

- GUC

This is for Opensocial Gadgets - It lasted 2007-2013, and the XML Proxy is likely being kept up for legacy applications that use it even after deprecation. [See](https://developers.google.com/sites/gadgets/site_gadgets). You can actually insert HTML into these XML files, which the devs were probably unaware of at that time as being an attack. This can be paired with TardisProxy to run a proxy site in it.
