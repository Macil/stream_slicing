# stream_slicing

This is a Deno and Node.js library containing some utilities for working with
web standard streams (ReadableStream). This library is useful for incrementally
reading data from streams.

This library is available for Deno at https://deno.land/x/stream_slicing and is
available for Node.js on npm as
[stream-slicing](https://www.npmjs.com/package/stream-slicing).

## Examples

```ts
import { PartialReader } from "https://deno.land/x/stream_slicing/partial_reader.ts";

const response = fetch("...");
const stream = response.body!;
const partialReader = PartialReader.fromStream(stream);
const header = await partialReader.readAmountStrict(30);
// `header` will be a 30 byte long Uint8Array
const nextMegabyteStream = partialReader.streamAmount(1024 * 1024).stream;
// `nextMegabyteStream` will be a ReadableStream of the next
// megabyte of data read from `stream`.
```

The Deno library
[streaming_zip's read.ts](https://github.com/Macil/deno_streaming_zip/blob/main/read.ts)
shows some real-world examples of this library being used for parsing zip file
data from a stream.

## API

### partialReaderFromDenoFsFile

[API Docs](https://doc.deno.land/https://deno.land/x/stream_slicing/deno_helpers.ts/~/partialReaderFromDenoFsFile)

Helper function for creating a PartialReader from a Deno.FsFile with seeking
support configured.

```ts
import { partialReaderFromDenoFsFile } from "https://deno.land/x/stream_slicing/deno_helpers.ts";

const partialReader = partialReaderFromDenoFsFile(await Deno.open("foo.zip"));
```

### PartialReader

[API Docs](https://doc.deno.land/https://deno.land/x/stream_slicing/partial_reader.ts/~/PartialReader)

The `PartialReader` class is exported from `partial_reader.ts`, and you
instantiate it by calling `PartialReader.fromDenoFsFile(file: Deno.FsFile)` or
`PartialReader.fromStream(stream: ReadableStream, options?: PartialReaderOptions)`.
The class contains the following methods:

- **limitedRead(maxSize: number)** Like calling read() on a reader of the
  stream, but returns no more than `maxSize` bytes at a time.
- **readAmount(size: number)** Reads and returns `size` bytes from the stream,
  or fewer if the stream ends while reading.
- **readAmountStrict(size: number)** Reads and returns `size` bytes from the
  stream. Throws an error if the stream ends while reading.
- **skipAmount(size: number)** Skips over `size` bytes from the stream. If you
  are working with a local file, make sure to use
  `partialReaderFromDenoFsFile()` or provide the `seek` option to
  `PartialReader.fromStream()` so that efficient seeking can be done, otherwise
  seeking will be done by reading and then ignoring data.
- **streamAmount(size: number)** Returns an object with a `stream` property
  containing a ReadableStream that forwards the next `size` bytes from the
  PartialReader's stream.

There is no `streamAmountStrict(size: number)` method that returns a stream that
errors if PartialReader's stream ends early. You must use `streamAmount()` and
`ExactBytesTransformStream` together if you want to accomplish this:

```ts
import { ExactBytesTransformStream } from "https://deno.land/x/stream_slicing/exact_bytes_transform_stream.ts";
import { PartialReader } from "https://deno.land/x/stream_slicing/partial_reader.ts";

const response = await fetch("...");
if (!response.ok) throw new Error("Bad response: " + response.status);
const partialReader = PartialReader.fromStream(response.body!);
const nextMegabyteStream = partialReader
  .streamAmount(1024 * 1024).stream
  .pipeThrough(new ExactBytesTransformStream(1024 * 1024));
```

### ExactBytesTransformStream

[API Docs](https://doc.deno.land/https://deno.land/x/stream_slicing/exact_bytes_transform_stream.ts/~/ExactBytesTransformStream)

The `ExactBytesTransformStream` class is exported from
`exact_bytes_transform_stream.ts`, and you instantiate it by calling
`new ExactBytesTransformStream(size: number)`. The class is a TransformStream
that will emit an error if a number of bytes unequal to `size` are piped through
it.
