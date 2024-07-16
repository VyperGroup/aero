# Separating your sandboxing code - DRAFT 📝

I recommend moving all of your sandboxing and rewriting code (also used inside of the browser JS) inside of a Sandboxing library where you can build separately and use inside of your proxy. This allows other proxy devs to quickly develop their proxies without worrying about the complex parts and skipping to how they think the handler should function, but it also makes maintainability easier.
