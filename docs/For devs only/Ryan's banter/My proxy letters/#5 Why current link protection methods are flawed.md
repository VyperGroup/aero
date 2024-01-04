# Why current link protection methods are flawed

This is a big problem, which is a factor in the community slowing down; their users can't simply use their sites.

## Links are easily discoverable

Why do proxy communities go so far to try to protect links?

We need to encourage link sharing. Links are public, no matter how hard you try to hide them. Most TLD zones are public, and almost all of them are indexable (they don't have robots.txt, so they will show up on Google, for example). It's also incredibly easy to leak links. Servers that try to hide links currently use flawed bots. You just need enough Discord alts per link times the number of links per month. Most of their users share the links anyway. Each time a link is leaked, a few dollars are lost. This isn't sustainable, which is why proxies are struggling with payments. This is why I created [Dispenser](x). Dispenser gives everyone the same filters and the same link. When this link is blocked, it will automatically give you a new one. It will also never give duplicates to somebody. This is only the tip of the iceberg when it comes to how smart and configurable Dispenser really is.

## Links are hard to share, and proxy sites are hard to discover

As I discussed, sharing links is important. Right now, with proxy communities, you need to be inside the Discords for each different site owner to get their unblocked links from or even know about their proxy sites. With the [Dispenser V3 update](x), it allows you to easily get links from other Discord servers without abuse, and you will be able to learn about other Discord communities and request links from them through its website.

## Nobody makes an effort in truly fooling the filters

I have seen some cloaks, but they are really obvious to sysadmins, and most proxies automatically scan the source code anyway, so this isn't useful. It's getting harder to conceal your proxy every day, so this clearly isn't sustainable. These need to be implemented on the backend. The problem with even this is that a lot of users need to be in the loop (usually on the Discord server) to know how these measures work. You need **anti-filter detection**. You don't really need to make links harder to get, but rather work on making them harder to block. My attempt at solving this is through [Filter Lock](x). It only lets you into the site if you are on a computer that restricts internet access (e.g., a school computer) or if you know the secret unlock code.
