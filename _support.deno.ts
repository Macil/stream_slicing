// This file is a basic pass-through in Deno. It exists so it can be
// swapped out in the Node.js version of this library because Node.js's
// Typescript types are a little different.

type _ReadableStreamDefaultReadResult<T> = ReadableStreamDefaultReadResult<T>;
type _ReadableStreamBYOBReader = ReadableStreamBYOBReader;
export type {
  _ReadableStreamBYOBReader as ReadableStreamBYOBReader,
  _ReadableStreamDefaultReadResult as ReadableStreamDefaultReadResult,
};
