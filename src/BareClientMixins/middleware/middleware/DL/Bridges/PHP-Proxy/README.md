# PHP-Proxy middleware bridge

This lets you legacy PHP-Proxy modules inside of modern proxies

It will use [php-wasm](https://github.com/seanmorris/php-wasm) to run the PHP. It will work by retriving the listeners that have been created in PHP, through the middleware passing in the events as a PHP object, and then after it is validated it will convert this PHP object into a response, which will then be returned. This will all happen in the http middleware.
