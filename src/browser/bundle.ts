const ctx = require.context(`./api`, true, /\.ts$/);
ctx.keys().forEach(ctx);

const ctxMW = require.context(`../middleware`, true, /inject.(\.js|\.ts)/);
ctxMW.keys().forEach(ctxMW);

// TODO: Implement auto api interception