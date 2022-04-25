// npm publishing instructions:
//  deno run -A scripts/build_npm.ts [VERSION]
//  cd npm && npm publish
import { build, emptyDir } from "https://deno.land/x/dnt@0.23.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: [
    { name: "./partial_reader", path: "./partial_reader.ts" },
    {
      name: "./exact_bytes_transform_stream",
      path: "./exact_bytes_transform_stream.ts",
    },
  ],
  outDir: "./npm",
  shims: {
    deno: "dev",
  },
  mappings: {
    "./_support.deno.ts": "./_support.node.ts",
    "https://deno.land/x/deferred_promise@v1.0.0/mod.ts": {
      name: "@macil/deferred-promise",
      version: "^1.0.0",
    },
  },
  typeCheck: false,
  package: {
    // package.json properties
    name: "stream-slicing",
    version: Deno.args[0],
    description:
      "Deno library containing utilities for working with web standard streams",
    license: "MIT",
    sideEffects: false,
    repository: {
      type: "git",
      url: "git+https://github.com/Macil/stream_slicing.git",
    },
    bugs: {
      url: "https://github.com/Macil/stream_slicing/issues",
    },
  },
});

await Deno.copyFile("LICENSE.md", "npm/LICENSE.md");
await Deno.copyFile("README.md", "npm/README.md");