import { PartialReader, type PartialReaderOptions } from "./partial_reader.ts";

export function factoryArgsFromDenoFsFile(
  file: Deno.FsFile,
): [ReadableStream<Uint8Array>, PartialReaderOptions] {
  const stream = file.readable;
  const options: PartialReaderOptions = {
    seek: (amount) => file.seek(amount, Deno.SeekMode.Current),
  };
  return [stream, options];
}

/**
 * Construct a {@link PartialReader} from a {@link Deno.FsFile}.
 * This enables efficient seeking.
 *
 * Internally this will return a subclass of PartialReader based on whether the `stream`
 * supports byob mode ("bring your own buffer") readers, which are more efficient for some
 * use-cases.
 */
export function partialReaderFromDenoFsFile(file: Deno.FsFile): PartialReader {
  return PartialReader.fromStream(...factoryArgsFromDenoFsFile(file));
}
