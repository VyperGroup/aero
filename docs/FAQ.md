# FAQ

## What are aero's priorites?

1. Site support
2. Efficiency
3. Easy to implement / interopabillity with other proxies. To the extend of making libraries that other proxies can use. If you see "for proxies" in the heading of the Markdown it means that it can generate a bundle independent of aero.
4. Easy to understand

## Why doesn't aero work on iOS / Safari?

The bug is Apple's fault not ours, since Safari doesn't fully support the Service Worker standard. This would normally be fine in most mobile operating systems but due to the restrictions apple imposes on the apps, browsers are forced to use Safari's engine. This yet another problem with monopolies and proprietary software. We will eventually support Safari, but we will need a willing contributor that has access to an Apple device or someone who is willing to volunteer 🙏. We need to rule out which SW api in specific that Safari doesn't work with, and then make an Apple specific implementation of the feature in question that uses the api.
