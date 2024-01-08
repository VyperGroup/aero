# Censordodge middleware bridge

[Plugin examples](https://github.com/ryanmab/CensorDodge/tree/master/plugins)

It will use [@php-wasm by Wordpress](https://www.npmjs.com/package/@php-wasm/web) to run the PHP.

It will work by creating a dummy censorDodge class and it will emulate censorDodge::addAction
It will pipe the handler to JS with [messages](https://wordpress.github.io/wordpress-playground/api/web/class/WebPHP#onMessage), where it will become a handler in req.ts.
