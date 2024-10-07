# How to run server-only aero

TODO: There are many environments where Service Workers aren't viable...

1. Install rust and cargo with rustup if you haven't already: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. Build and install winterjs if you haven't already: `cargo install --git https://github.com/wasmerio/winterjs winterjs`
3. Run `wasmer run wasmer/winterjs --net --mapdir=tests:tests dist/server/rust/rustHandler.rs`
TODO: Make aero build to `dist/sw/handle.js`