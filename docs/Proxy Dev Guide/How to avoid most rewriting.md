# How to avoid most rewriting in a SW proxy (SW catch-all content rewriting) - DRAFT 📝

Many proxies rewrite URLs; even SW proxies do this without realizing that you don't need to rewrite URLs on the client.
You use a relative URL in your URL constructor to get the most up-to-date href URL of the window that triggered the fetch event. You use the most.

This small snippet of code is how I avoid having to rewrite content URLs (src) and CSS URLs

You know how you rewrite src because when a SW sees the src, it only gets the path, right?
This code will autofill what is behind that.

TODO: This is a stub
