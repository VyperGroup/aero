# PHP-Proxy middleware bridge

This lets you legacy [PHP-Proxy plugins](https://github.com/Athlon1600/php-proxy-app/tree/master/plugins) inside of modern proxies

It will use [@php-wasm by Wordpress](https://www.npmjs.com/package/@php-wasm/web) to run the PHP. The AbstractPlugin class will be emulated. The functions in AbstractPlugin will really be proxified using [__set](https://www.php.net/manual/en/language.oop5.overloading.php#object.call) (property overloading). When the functions in AbstractPlugin are set, it will [send a message to the JS](https://wordpress.github.io/wordpress-playground/api/web/class/WebPHP#onMessage) (in req.ts), which will create a handler inside of resp.ts where the PHP data will be converted into a proper request and response.
