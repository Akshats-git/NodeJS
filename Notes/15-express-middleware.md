# 15 — Express Middleware

[Watch](https://www.youtube.com/watch?v=n2c0mf1sza4)

Middleware is one of the most important Express concepts. We already used one in the last video:
`express.urlencoded`. Now we look at what middleware is and write our own.

## The concept

Normally the flow is: a client sends a request, Express matches it to a route handler, the
handler runs and sends a response, and the request-response cycle ends.

Middleware sits **in between**. The request reaches the middleware **first**. The middleware can
process the request and then do one of two things:

- If everything is fine, **forward** the request to the next middleware or the route handler.
- If something is wrong (an invalid or unauthorized request), **end** the cycle right there and
  send a response, so the request never reaches the route handler.

You can have several middlewares in a chain:

```
client -> middleware 1 -> middleware 2 -> middleware 3 -> route handler -> response
```

The request passes through each one in order. Any middleware can stop the chain or pass it
along. Think of middleware as a plugin that runs on every request.

## The middleware function

A middleware is a function with access to three things:

```js
(req, res, next) => { ... }
```

- `req` — the request object.
- `res` — the response object.
- `next` — a function that calls the **next** middleware in the stack.

Per the Express docs, a middleware function can:

- run any code,
- make changes to the request and response objects,
- end the request-response cycle, and
- call the next middleware in the stack with `next()`.

## Creating middleware with app.use

Register a middleware with `app.use`:

```js
app.use((req, res, next) => {
  console.log("Hello from Middleware 1");
  next();
});
```

Three behaviors to understand:

- **Hang:** if the middleware neither calls `next()` nor ends the response, the request gets
  stuck and never completes. This is a bug.
- **End the cycle:** return a response to stop here. The request never reaches the route.
  ```js
  app.use((req, res, next) => {
    return res.json({ msg: "Hello from Middleware 1" });
  });
  ```
- **Forward:** call `next()` to pass control to the next middleware or the route handler.
  Express figures out what "next" is.

## Multiple middlewares and order

Middlewares run in the **order they are registered**, from top to bottom:

```js
app.use((req, res, next) => {
  console.log("Hello from Middleware 1");
  next(); // hand off to the next one
});

app.use((req, res, next) => {
  console.log("Hello from Middleware 2");
  return res.end(); // ends the cycle here
});
```

Middleware 1 runs and calls `next()`, so Middleware 2 runs. If Middleware 1 returned a response
instead of calling `next()`, Middleware 2 would never run. Whichever middleware ends the
response finishes the cycle.

## Modifying the request and response

A middleware can attach properties to `req`, and they stay available to every later middleware
and to the route handler:

```js
app.use((req, res, next) => {
  req.myUsername = "Piyush Garg";
  next();
});
```

Now `req.myUsername` can be read in the next middleware and in the route handler. This is
exactly how `express.urlencoded` works: it takes the incoming form data, converts it to an
object, and sets `req.body` before forwarding the request.

A real use case: a middleware could query the database for the current user's details and attach
them, so the route handler can read them directly:

```js
app.use((req, res, next) => {
  // const info = await db... (look up the user)
  req.creditCardNumber = info.creditCardNumber;
  next();
});
```

## Practical use case: request logging

Instead of logging inside each route, use one logging middleware that runs on every request. It
writes to a file with `fs` and then calls `next()`:

```js
const fs = require("fs");

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `${Date.now()}: ${req.ip} ${req.method}: ${req.path}\n`,
    (err, data) => {
      next();
    }
  );
});
```

- `req.method` is the HTTP method, `req.path` is the path, and `req.ip` is the client's IP
  address (in a real deployment this becomes the real user's IP).
- End each line with `\n` so entries stay on separate lines.
- Call `next()` inside the write callback so the request continues after the log is written.

This keeps each route clean, since cross-cutting work like logging lives in one place.

## Types of middleware

- **Built-in**: shipped with Express, like `express.json()`, `express.urlencoded()`, and
  `express.static()`.
- **Third-party**: installed from npm, like `morgan` for request logging or `cors`. We use some
  of these in later videos.

Two more standard forms worth knowing:

- **Path-specific middleware**: `app.use("/admin", mw)` runs `mw` only for paths under `/admin`,
  not for every request.
- **Error-handling middleware**: written with **four** arguments, `(err, req, res, next)`.
  Express treats a four-argument function as an error handler and routes errors to it.

## Summary

- Middleware is a function `(req, res, next)` that runs on the way to the route handler.
- Register it with `app.use`; it runs in registration order.
- It can run code, modify `req`/`res`, end the response, or call `next()` to continue.
- Not calling `next()` and not ending the response leaves the request hanging.
- Attaching to `req` (like `req.body`) passes data down the chain.
- Middleware can be built-in, third-party, path-specific, or error-handling.
