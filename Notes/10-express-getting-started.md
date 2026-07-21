# 10 — Getting Started with ExpressJS

[Watch](https://www.youtube.com/watch?v=N2-FyBBxOZA)

Before using Express, understand the problem it solves.

## The problem with the raw http module

With the plain `http` module, everything lives inside one big handler callback. Even if you
pull that callback out into a named function, the pain is the same:

```js
const http = require("http");

function myHandler(req, res) {
  // all routing, all methods, all parsing... 100+ lines here
}

const myServer = http.createServer(myHandler);
```

The problems:

1. You write a `case` for every single route by hand.
2. Inside each route you handle every HTTP method (GET, POST, PUT, PATCH, DELETE) separately.
3. For anything extra (parsing the URL, reading query params, headers) you reach for different
   modules and wire them up yourself.

You are handling everything from scratch. What you really want is a library that writes the
handler for you. You just tell it what to do. That library is **Express**.

## What Express is

Express is a **fast, unopinionated, minimalist web framework for Node.js**. It takes over the
messy handler work so you can focus on your routes.

## Install it

```bash
npm install express
```

**Express 5** is the current major version, so a fresh `npm install express` installs 5.x. The
course uses Express 4.18.2. Basic routing works the same on both, but Express 5 has some
breaking changes under the hood. To match the course exactly, install version 4 with
`npm install express@4`; otherwise the code here still works on 5.

## Basic usage

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  return res.send("Hello from home page");
});

app.get("/about", (req, res) => {
  return res.send(`Hello from about page, ${req.query.name}`);
});

app.listen(8000, () => console.log("Server started"));
```

What is happening:

- `express()` creates your application. `app` is actually a function (a request handler with
  methods attached), which is why you could even pass it to `http.createServer(app)`.
- `app.get(path, handler)` registers a handler for **GET** requests on that path. There is also
  `app.post`, `app.put`, `app.patch`, `app.delete`, and so on. Each handler runs only for that
  specific path **and** method, so you no longer mix everything into one function.
- The handler gets `req` and `res`, scoped to just that route.
- `res.send(...)` sends the response. It also sets the right `Content-Type` header for you
  (text, HTML, JSON) automatically.
- `req.query.name` reads a query parameter. Express parses the query string for you, so you no
  longer need the `url` module.

Now `/about?name=Piyush` routes to the `/about` handler and `req.query.name` is `Piyush`. No
manual URL parsing.

## app.listen does the http work for you

You do not need to call `http.createServer` yourself. `app.listen(port, callback)` internally
requires the `http` module, creates the server, and attaches the listener. So the whole thing
is just:

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello World"));

app.listen(3000, () => console.log("Server started"));
```

This matches the official "Hello World" from the Express docs (they use port `3000`).

## Benefits

- The code is much cleaner and more modular.
- Routing by path and method is easy: one `app.method(path, handler)` line each.
- Query params and dynamic routes (covered next) become simple.
- Many features are built in, so you write less boilerplate.

Because Express handles URL and query parsing, you can remove the earlier `url` package:

```bash
npm uninstall url
```

## Should you always use Express over http?

Yes, in practice you write your server code with Express because raw `http` code is painful and
verbose. But it is worth understanding that Express is **built on top of the `http` module**. It
is not magic. Knowing the internals (from the previous videos) is why we started there.

## Summary

- Raw `http` forces you to hand-roll routing, method handling, and parsing. It does not scale.
- Express is a minimalist framework built on `http` that does this for you.
- `const app = express()`, then `app.get/post/...(path, handler)`, then `app.listen(port, cb)`.
- `res.send()` sends responses; `req.query` gives parsed query params.
- From here on, we write server code in Express.
