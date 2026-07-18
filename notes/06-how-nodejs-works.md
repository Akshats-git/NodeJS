# 06 — How NodeJS Works

[Watch](https://www.youtube.com/watch?v=_eJ6KAb56Gw)

This is the important architecture video. It explains how Node runs your code step by step, its
event loop, its threads, and how it handles requests.

## The two major components of Node.js

Node.js is built from two main parts:

1. **V8 engine** — the actual engine that executes your JavaScript. It is the same engine that
   powers Chrome. It is written in C++ and JavaScript.
2. **libuv** — a library that implements two things: the **event loop** and the **thread
   pool**. This is what lets your asynchronous code run and lets your whole program run
   efficiently on a single thread.

So Node is basically V8 (runs your code) plus libuv (event loop and thread pool for async work
and single-thread efficiency).

## What happens when you run `node index.js`

When you run the command, Node does this:

1. Creates a **Node process**.
2. That process runs on a **single thread**, called the **main thread**. Your whole main code
   runs on this one thread.

Inside the main thread, these steps run in sequence:

1. **Initialize the project.**
2. **Execute top-level code.** Top-level code is code written directly in the script, not
   inside a function or a callback. For example:
   ```js
   console.log("hey");   // top level
   const a = 24;         // top level
   ```
   Code inside a function or callback is not top-level code.
3. **Require modules.** All your imports (like `require("fs")`) run here, in sequence.
4. **Register event callbacks.** Any callbacks (for example `server.on("request")`,
   `server.on("close")`, socket events) are registered, not run. They are registered in the
   event loop.
5. **Start the event loop.**

Alongside the main thread, a **thread pool** is also available.

## The thread pool

The thread pool holds a set of threads. Their job is to run **CPU-intensive tasks**, which are
too heavy to run on the main thread. Those tasks are offloaded to these threads.

Examples of CPU-intensive tasks:

- File system operations
- Cryptography (encryption, decryption, hashing)
- Compression

By default the thread pool has **4 threads**, and it can go up to **128**. Four threads means
you can run four CPU-intensive tasks in parallel. When the event loop starts, it offloads any
CPU-intensive work to these threads.

## The event loop phases

Once the event loop starts, top-level code has already run. The event loop then goes through
these phases in order, on the main thread:

1. **Expired timer callbacks.** Callbacks for `setTimeout` and `setInterval` whose time is up.
   These get top priority.
2. **I/O polling.** For example, the success callback after a file read finishes runs here.
3. **setImmediate callbacks.**
4. **Close callbacks.** For example a server close or socket close callback.

After these phases, the loop checks: **is any task still pending?**

- If **no**, the program exits.
- If **yes**, the loop starts again from the top (expired timers, I/O polling, setImmediate,
  close callbacks) and keeps repeating.

## Walking through the output order

### Example 1: timer plus top-level code

```js
const fs = require("fs");

setTimeout(() => {
  console.log("Hello from Timer 1");
}, 0);

console.log("Hello from top level code");
```

- Top-level code runs first on the main thread, so `Hello from top level code` prints first.
- Then the event loop starts, sees the expired 0ms timer, and runs its callback, so
  `Hello from Timer 1` prints second.

The top-level `console.log` runs on the main thread; the timer callback runs inside the event
loop. That is why the top-level line comes first.

### Example 2: add setImmediate

```js
setTimeout(() => console.log("Hello from Timer 1"), 0);
setImmediate(() => console.log("Hello from Immediate function 1"));
console.log("Hello from top level code");
```

Output order:

1. `Hello from top level code` (top level)
2. `Hello from Timer 1` (expired timer phase)
3. `Hello from Immediate function 1` (setImmediate phase)

This matches the architecture.

### The tricky part: timer vs setImmediate at the top level

If you remove the top-level `console.log` and keep only `setTimeout(0)` and `setImmediate`, the
order can flip. Sometimes `setImmediate` runs before the timer.

Why? According to Node's official docs, when the script is **not inside an I/O cycle** (that is,
this is top-level / main module code), the order in which `setTimeout(0)` and `setImmediate`
run is **non-deterministic**. It is bound by the performance of the process, so you cannot rely
on it.

Note: this is only uncertain at the top level. **Inside an I/O cycle** (inside a file read
callback), `setImmediate` always runs before `setTimeout`.

### I/O polling example

```js
const fs = require("fs");

setTimeout(() => console.log("Hello from Timer 1"), 0);
setImmediate(() => console.log("Hello from Immediate function 1"));

fs.readFile("sample.txt", "utf-8", () => {
  console.log("IO polling finished");
});

console.log("Hello from top level code");
```

Reading a file takes time depending on its size. A 1GB file could take a while, a small one
almost none. So the event loop does not wait. It runs the timer, runs setImmediate, checks for
pending tasks (the file is still reading), loops again, and when the file finishes reading, its
callback runs in the I/O polling phase.

Rough output:

1. `Hello from top level code`
2. `Hello from Timer 1`
3. `Hello from Immediate function 1`
4. `IO polling finished`

When the file read finishes, its callback can then start new timers, and the loop continues
until nothing is pending, then exits.

## Proving the thread pool with crypto

Use the built-in `crypto` module to hash passwords. Hashing is CPU-intensive, so it runs on the
thread pool.

```js
const crypto = require("crypto");

const start = Date.now();

crypto.pbkdf2("password1", "salt1", 100000, 1024, "sha512", () => {
  console.log("Password 1 done", Date.now() - start);
});
// ...repeat for password2, password3, password4
```

- Running **4** hashes takes about **600ms**, because there are 4 threads and 4 tasks, so all
  run in parallel, one per thread.
- Running a **5th** hash makes that one take about **double** the time (~1200ms), because it
  has to wait for a thread to become free.
- Running **6** hashes: the first 4 finish around 600ms, the next 2 around 1200ms.

### Controlling the thread pool size

You can change the number of threads with the `UV_THREADPOOL_SIZE` variable:

```js
process.env.UV_THREADPOOL_SIZE = 10;
```

- Set to **10**: all 6 password hashes finish at almost the same time.
- Set to **2**: they finish in pairs.
- Set to **1**: each one waits for the single thread, so everything is slow.

## Node vs multi-threaded languages

Compare Node.js with a multi-threaded language like PHP.

### How Node handles requests

Many users hit the server, but all requests are handled by a single event loop running on one
thread (the main thread). Node tries to resolve every request on this single event loop. If a
request contains CPU-intensive work, Node can offload just that part to the thread pool, whose
size you control.

So Node uses a kind of **hybrid approach**: resolve all requests on a single thread, but
offload any heavy CPU work inside a request to the thread pool, making it more efficient.

### How PHP handles requests

Languages like PHP have no event loop concept and are not single-threaded in this way. Instead,
they create a **new thread for every request**. Each request is resolved by its own thread.

The problem: at one particular moment, all threads can be busy. Any extra users then have to
wait for a thread to become free before their request can be resolved, just like the 5th
password hash had to wait for a free thread earlier.

### Which to use

- If you are building an **API server** (for example a RESTful API) with little or no
  CPU-intensive work, Node.js is the best option. You can complete everything on the single
  thread, which is very efficient.
- If your server has heavy **CPU-intensive** work, a multi-threaded language may suit it
  better.
- As a backend developer you can take a **hybrid approach**: use multiple microservices where
  Node.js servers handle the REST APIs, and delegate CPU-intensive work to another language
  that uses multiple threads.

This is how Node.js stands out. Remember, Node is not a programming language. It is a runtime
environment, but now you understand the architecture behind how it runs JavaScript.

## Where promises run

Promise callbacks were not covered in the phases above. So when does a resolved promise's
callback run?

Whenever the event loop **transitions between phases** (for example from expired timers to I/O
polling, or from I/O polling to setImmediate), it checks in that transition whether any promise
has completed (fulfilled). If a completed promise has a callback, it runs there.

So promise callbacks run **between** the event loop phases, during those transitions.

## Phases are FIFO queues

Each phase in the event loop is backed by a FIFO (first in, first out) queue, and each of those
boxes (expired timers, I/O polling, setImmediate, close callbacks) is called a phase. Together
they form Node's internal architecture.

## Summary

- Node = **V8** (runs JS) + **libuv** (event loop + thread pool).
- Running a file: create a process on the **main thread**, then init, top-level code, require
  modules, register callbacks, start the event loop.
- The **thread pool** (default 4, up to 128) runs CPU-intensive work: file system, crypto,
  compression.
- Event loop phases: **expired timers → I/O polling → setImmediate → close callbacks**, repeat
  until nothing is pending.
- Timer vs setImmediate order is non-deterministic at the top level, but setImmediate wins
  inside an I/O cycle.
- Control threads with `UV_THREADPOOL_SIZE`.
- Promise callbacks run between phase transitions.
- Node handles requests on a single-threaded event loop and offloads CPU work to the thread
  pool (hybrid). It is great for API servers; delegate heavy CPU work elsewhere.
