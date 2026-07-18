# 05 — File Handling

[Watch](https://www.youtube.com/watch?v=YazJFb_i4A0)

How to do operations on files using Node.

## Setup

Make a new file called `file.js`. Do not name it `fs.js`, because that would clash with the
`fs` module name and confuse things. All the file handling work goes in `file.js`.

## The fs module

Node's built-in module for files is `fs`, which stands for **file system**. It is built in, so
you require it without a `./`:

```js
const fs = require("fs");
```

The `fs` module lets you interact with the file system. Its functions are modeled on the
standard POSIX functions.

An important theme in this video is the difference between synchronous and asynchronous
functions. Most `fs` functions come in two forms: a normal (async) version and a `Sync`
version.

## Writing a file

Use `writeFileSync` (synchronous) or `writeFile` (asynchronous).

### Synchronous

```js
fs.writeFileSync("./test.txt", "Hey there");
```

- `Sync` means it is a synchronous call.
- The first argument is the file path. `./` means the current directory, so this creates
  `test.txt` in the current folder.
- The second argument is the content to write.

Run it with `node file.js` and `test.txt` is created with that content. Run it again with new
content and the file is overwritten. The old content is deleted and the file is recreated.

### Asynchronous

`writeFile` is the async version. The only difference is that it takes a callback function at
the end, which receives an error just in case something goes wrong:

```js
fs.writeFile("./test.txt", "Hello World", (err) => {
  // handle err if present
});
```

It produces the same result.

## Sync vs async (preview)

The big questions are: what is the difference between the sync and async calls, and which
should you use? This connects to **blocking and non-blocking** requests. To really understand
it you need Node's architecture, the event loop, and threads.

The next video covers all of this in depth. It is a super important topic. If you are a backend
developer and ignore it, your server can crash, and it is almost always asked in interviews.
For now, just know both forms do the same job. One works asynchronously inside, the other
synchronously.

## Reading a file

Say you have `contacts.txt`:

```
Piyush, +9111
John, 222
```

### Synchronous read

```js
const result = fs.readFileSync("./contacts.txt", "utf-8");
console.log(result);
```

- The second argument is the encoding. Use `utf-8`, a standard text encoding, so Node knows
  how to decode the file. Files can be text or binary, so the encoding tells it how to read.
- The synchronous read returns the content directly into a variable.

### Asynchronous read

`readFile` is the async version. If you call it without a callback you get an
`invalid callback` error, because it does not return the result. Instead it expects a callback
that receives `(err, result)`:

```js
fs.readFile("./contacts.txt", "utf-8", (err, result) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log(result);
  }
});
```

### The key difference

- The **sync** version returns the result, and if something fails it throws an error, which you
  handle with `try/catch`.
- The **async** version returns nothing (undefined). It hands you the error and the result
  through the callback instead.

## Appending to a file

`writeFileSync` overwrites the whole file. To keep adding entries below the existing content,
use append. There is `appendFile` (async) and `appendFileSync` (sync):

```js
fs.appendFileSync("./test.txt", `${Date.now()}\n`);
```

- The content must always be a string, so wrap non-strings (like `Date.now()`) in a string.
- `\n` adds a new line, so each entry goes on its own line.

### A real use case: logs

When you build a web server, you can create a `log.txt` file and append an entry on every
incoming request: the user's IP address, the time, and which resource they requested. This
builds a full log and is very useful for monitoring. On each request you use the `fs` module to
append a line to `log.txt`.

## More fs operations

Every operation has both a normal (async) and a `Sync` version.

### Copy a file

```js
fs.copyFileSync("./test.txt", "./copy.txt");
```

This creates `copy.txt` as a copy of `test.txt`. You can pass options as a later argument.

### Delete a file

Deleting is not called `delete`. It is `unlink` / `unlinkSync`:

```js
fs.unlinkSync("./copy.txt"); // file is deleted
```

### File status

```js
const stats = fs.statSync("./test.txt");
console.log(stats);
```

The stats include the file size (in bytes), when it was created, when it was last modified, and
an id. You also get helpers:

```js
stats.isDirectory(); // false
stats.isFile();      // true
```

### Make a directory

`mkdir` / `mkdirSync` creates folders:

```js
fs.mkdir("my-docs", () => {});
```

Pass `{ recursive: true }` to create nested folders in one go:

```js
fs.mkdir("my-docs/a/b", { recursive: true }, (err) => {});
```

This recursively creates `my-docs`, then `a`, then `b`.

## Summary

- The `fs` module handles files in Node.
- You can read, write, append, open, copy, and delete files, and create and delete folders.
- Plain browser JavaScript cannot touch the file system for security reasons. Node gives you
  the `fs` module to do it.
- Most important: the difference between synchronous and asynchronous (blocking vs
  non-blocking) is covered in the next video on the event loop. Do not skip it.
