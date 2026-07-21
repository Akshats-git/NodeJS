# 07 — Building an HTTP Server in NodeJS

[Watch](https://www.youtube.com/watch?v=ZQsrcayZcSk)

We build our first web server using Node's built-in `http` module.

## Project setup

Start in an empty project folder (named `server` here). First initialize it:

```bash
npm init
```

Accept the defaults. This creates a `package.json` with basic scripts and config. Then create
your main file, `index.js`.

Naming the entry file `index.js` is a good practice. In a real project there are many files and
modules, and everyone looks for `index.js` first to find where execution starts. It is not
required, but it is a good convention. Note that `npm init` already set `main` to `index.js` in
`package.json`, so that is your entry point.

## Creating the server

The `http` module is built into Node, so require it without a `./`:

```js
const http = require("http");

const myServer = http.createServer((req, res) => {
  console.log("New request received");
  res.end("Hello from server");
});
```

- `http.createServer` builds a web server for you.
- It takes a **request listener** callback. This callback runs on **every** incoming request.
- The callback gets two arguments: `req` (request) and `res` (response).
  - `req` is a big object holding all the information about the incoming request: what was
    requested, the headers, the HTTP version, and client details.
  - `res` is what you use to send a response back. `res.end(...)` ends the response and sends
    the given data.

## Listening on a port

A server needs a **port** to run on. Think of a port like a door. A house has many doors, and
the port number picks which door your server listens at.

```js
myServer.listen(8000, () => {
  console.log("Server started");
});
```

- On your local machine almost all ports are open. Common choices are `8000`, `8001`, `8002`.
- Only one server can run on a given port at a time. If you run multiple servers, each needs a
  different port.
- The callback is optional. It runs once the server has started listening successfully. If you
  never see `Server started`, the server did not start.

## Running it

Add a start script to `package.json` (a good habit rather than typing `node index.js` each
time):

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

Run it:

```bash
npm start
```

Now open the browser at `http://localhost:8000`. You see `Hello from server`, and the terminal
logs `New request received`. The flow: the browser sends a request, it reaches your server, the
callback runs, it logs the message, and it sends the response back.

If you change the server code, restart the server (`Ctrl + C` to stop, then `npm start` again)
for the change to take effect. Node does not auto-reload by default. A tool like `nodemon` can
do that, which comes in a later video.

## Inspecting the request

The `req` object carries everything about the request. For example, the headers:

```js
console.log(req.headers);
```

**Headers** are extra information attached to the request, such as the `host`
(`localhost:8000`) and the `user-agent` (which browser and OS the client uses). Logging the
whole `req` object shows a very large object full of client information.

You will often see two requests per page load. The browser sends an extra request for the
`favicon.ico` (the little tab icon). That is normal and nothing to worry about.

## Logging requests to a file

Recall the `fs` module. Let us append a log line on every incoming request.

```js
const http = require("http");
const fs = require("fs");

const myServer = http.createServer((req, res) => {
  const log = `${Date.now()}: ${req.url} New request received\n`;
  fs.appendFile("log.txt", log, (err) => {
    res.end("Hello from server");
  });
});

myServer.listen(8000, () => console.log("Server started"));
```

Use the **non-blocking** `fs.appendFile`, not `fs.appendFileSync`. The reason is that
`appendFileSync` runs on the single main thread and blocks the event loop. While it writes, your
server cannot handle any other request. The async `fs.appendFile` offloads the file work and
keeps the main thread free to serve other requests. So in a request handler, always prefer the
non-blocking version.

Now `log.txt` fills with a line per request. You can log anything useful, like the timestamp,
the requested URL, and the client IP address, which is handy for monitoring.

## Routing with req.url

You can send different responses based on what path the user requested. The requested path is
on `req.url`:

```js
const myServer = http.createServer((req, res) => {
  const log = `${Date.now()}: ${req.url} New request received\n`;
  fs.appendFile("log.txt", log, (err) => {
    switch (req.url) {
      case "/":
        res.end("Home page");
        break;
      case "/about":
        res.end("I am Piyush Garg");
        break;
      default:
        res.end("404 Not Found");
    }
  });
});
```

- `/` is the home page.
- `/about` returns the about text.
- Anything else falls to the default and returns `404 Not Found`.

Route on `req.url`, which holds the path and any query string (for example `/about?ref=x`). The
core `http` module has no `req.path`; that property only exists on Express's request object,
which is a different thing covered later.

This example sends a `404` body but does not set the actual HTTP status code. To truly return a
404, you would set `res.statusCode = 404` before `res.end(...)`. Status codes get their own
video later.

## Keep the handler non-blocking

Inside the request handler, always prefer **non-blocking** work if you want to support
concurrent (parallel) requests. Avoid heavy CPU-intensive work here, like image processing,
because it blocks the thread and makes every other user wait. This is the place to be careful.

You can send more than text from `res`. You can send HTML, images, and more. Sending full HTML
pages comes in a later video.

## Summary

- Use the built-in `http` module and `http.createServer(callback)` to make a server.
- The callback (request listener) runs on every request and gets `req` and `res`.
- `req` holds request info (`req.url`, `req.headers`, `req.method`, ...). `res.end(...)` sends
  the response.
- Call `server.listen(port, callback)` to start listening. One server per port.
- Route by checking `req.url`. Keep the handler non-blocking.
- This is the low-level way. Later we move to Express, but understanding the internals first is
  the goal.
