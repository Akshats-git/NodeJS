# 14 — Introduction to Postman for REST APIs

[Watch](https://www.youtube.com/watch?v=7OzNVIxPLH0)

The browser can only make GET requests from the address bar, so we cannot test POST, PATCH, or
DELETE that way. **Postman** is a free tool for sending any kind of request. We use it to finish
the project by implementing the POST route.

## Getting Postman

Download it from [postman.com](https://www.postman.com) for your platform and install it. It
helps you test and document APIs.

## Testing a GET request

Start the server (`npm start`, running on `http://localhost:8000`). In Postman, create a new
request, set the method to **GET**, and enter the URL:

```
http://localhost:8000/api/users
```

Use `http`, not `https`. On localhost there is no SSL certificate, so `https` gives an SSL
error.

Send it and you get the response. Useful things Postman shows:

- **Response views**: Raw, Pretty, and Preview.
- **Status code**: `200` means success (everything went fine). Status codes get their own video.
- **Time**: how long the request took (for example 6ms). In production you always want this
  low, because slow responses make users wait.
- **Size**: the size of the response.

## Making a POST request

Create a new request, set the method to **POST**, and use the URL:

```
http://localhost:8000/api/users
```

Right now the route just returns `{ status: "pending" }`. To send data with the request, open
the **Body** tab. You can send:

- **x-www-form-urlencoded** (form data, key-value pairs, like an HTML form)
- **raw** (for example JSON, used later)

Using form data, add keys `first_name`, `last_name`, `email`, `gender`, and `job_title` with
values.

## Reading the body needs middleware

On the server, Express puts submitted data on **`req.body`**:

```js
app.post("/api/users", (req, res) => {
  const body = req.body;
  console.log(body);
  return res.json({ status: "pending" });
});
```

But `body` logs as `undefined`. Express does not know how to parse the incoming data format by
default. You need a piece of **middleware** to parse it. Middleware are like plugins that run on
every request. Express has many, and there is a dedicated video on them later.

Add the built-in middleware that parses url-encoded form data:

```js
app.use(express.urlencoded({ extended: false }));
```

This runs on every request, reads url-encoded form data, turns it into a JavaScript object, and
puts it on `req.body`. Now `req.body` has `first_name`, `last_name`, `email`, `gender`, and
`job_title`.

To accept a raw **JSON** body instead, add `app.use(express.json())`. Both `express.urlencoded`
and `express.json` are built into Express, so you do not install a separate package.

## Implementing the POST route

Add the new user to the in-memory array and persist it to the mock file with the `fs` module:

```js
const fs = require("fs");

app.post("/api/users", (req, res) => {
  const body = req.body;
  const id = users.length + 1;

  users.push({ ...body, id });

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    return res.json({ status: "success", id });
  });
});
```

- `id` is generated on the server because the frontend does not send one. Here we use
  `users.length + 1`.
- `users.push({ ...body, id })` spreads the submitted fields and adds the id.
- `fs.writeFile` with `JSON.stringify(users)` writes the whole updated array back to
  `MOCK_DATA.json` (use the non-blocking `writeFile`, not the sync version).
- The response is sent inside the write callback, after the data is saved.

Send the POST in Postman, then refresh `/api/users` and the new user appears at the end.

## How this works in the real world

The `users.length + 1` id is fine for this mock setup, but it is fragile (deleting a user could
cause a collision). In a real app the **database** generates the id for you. The typical flow
is: take the incoming data, run validation on it (is the email valid, does the user already
exist), insert it into the database, and return the new id to acknowledge that the user was
created.

## Assignment: PATCH and DELETE

Implement the remaining routes yourself:

- **PATCH `/api/users/:id`** — edit the user with that id.
- **DELETE `/api/users/:id`** — delete the user with that id.

Both are simple JavaScript array operations on the `users` array (find and update, or filter
out), followed by writing the file back like the POST route does.

## Summary

- Use Postman to test POST, PATCH, and DELETE, which the browser cannot send directly.
- On localhost use `http`; watch the status code, time, and size.
- Send data in the request **Body**; read it on the server from `req.body`.
- `req.body` needs body-parsing middleware: `express.urlencoded(...)` for form data,
  `express.json()` for JSON.
- Generate the id and persist with `fs.writeFile` for now; a real database would handle ids.
