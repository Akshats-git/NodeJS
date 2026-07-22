# 13 — Building REST APIs with Node and Express

[Watch](https://www.youtube.com/watch?v=uNCrMvkPUAE)

Our first project: a REST API for users, built with Express and following good practices.

## Project setup

```bash
npm init          # accept defaults, creates package.json
npm install express
```

Create `index.js` as the entry point, with the boilerplate:

```js
const express = require("express");
const app = express();
const PORT = 8000;

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
```

## Planning the routes

We are designing a RESTful API for users, so we respect the HTTP methods and use resource-based
URLs:

| Method | Route             | Meaning                  |
| ------ | ----------------- | ------------------------ |
| GET    | `/users`          | list all users           |
| GET    | `/users/:id`      | get the user with that id |
| POST   | `/users`          | create a new user        |
| PATCH  | `/users/:id`      | edit the user with that id |
| DELETE | `/users/:id`      | delete the user with that id |

So `/users/1` and `/users/2` return single users by id, while `/users` returns the whole list.

## Getting mock data

There is no database yet, so we hardcode the data. [mockaroo.com](https://mockaroo.com)
generates fake data for testing. Create a schema with fields like `id` (row number),
`first_name`, `last_name`, `email`, `gender`, and `job_title`, set the count to 1000, choose
**JSON**, and download it. Save it in the project as `MOCK_DATA.json`.

Load it into your code:

```js
const users = require("./MOCK_DATA.json");
```

## GET all users (JSON)

```js
app.get("/api/users", (req, res) => {
  return res.json(users);
});
```

`res.json` sends raw JSON. Any frontend (a browser app, a mobile app, React) can consume it and
render it however it wants.

## Hybrid server: HTML for browsers, JSON for API clients

A good server supports both a browser and other clients (mobile apps, smart devices). The
convention is to serve HTML on plain routes and JSON under an `/api` prefix. The `/api` prefix
makes it clear that the route returns data, not a page.

```js
// browser: render an HTML page
app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
  `;
  return res.send(html);
});

// API clients: return JSON
app.get("/api/users", (req, res) => {
  return res.json(users);
});
```

`res.send` sends the HTML (server-side rendering), while `res.json` under `/api` sends data.
`.join("")` on the mapped array removes the commas that an array would otherwise print.

## Dynamic path parameters

To get one user by id, the id part of the URL must be dynamic. Express marks a dynamic segment
with a colon: `:id`. You read it from `req.params`.

```js
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});
```

- `:id` matches any value, so `/api/users/1`, `/api/users/2`, and so on all hit this handler.
- `req.params.id` is always a **string**, so convert it with `Number(...)` before comparing to
  the numeric `user.id`.
- `find` returns a single object (not an array), or `undefined` if no user matches. In a real
  API you would check for that and return a `404` when the user is not found.

## POST, PATCH, DELETE (stubs for now)

```js
app.post("/api/users", (req, res) => {
  // TODO: create a new user
  return res.json({ status: "pending" });
});
```

PATCH and DELETE need an id, since they act on a specific user:

```js
app.patch("/api/users/:id", (req, res) => {
  // TODO: edit the user with the given id
  return res.json({ status: "pending" });
});

app.delete("/api/users/:id", (req, res) => {
  // TODO: delete the user with the given id
  return res.json({ status: "pending" });
});
```

## Grouping routes with app.route

Notice that `/api/users/:id` is repeated for GET, PATCH, and DELETE. Express lets you group
handlers for the same path with `app.route`, so the path is written once:

```js
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    // TODO: edit the user with the given id
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    // TODO: delete the user with the given id
    return res.json({ status: "pending" });
  });
```

If the path ever changes, you change it in one place, and any future method for that path is
just another chained handler. This keeps the code DRY.

## Testing the other methods

The browser only makes GET requests from the address bar, so you cannot test POST, PATCH, or
DELETE that way. The next video installs **Postman**, a tool for sending any kind of request,
so we can test and document these endpoints.

## Summary

- Plan RESTful routes: `/api/users` and `/api/users/:id` with the right HTTP methods.
- Use mock data (mockaroo) loaded via `require("./MOCK_DATA.json")` until we add a database.
- `res.json` sends data; `res.send` sends HTML. Serve JSON under an `/api` prefix for a hybrid
  server.
- Read dynamic segments with `:id` and `req.params.id` (convert to Number to compare).
- Group same-path handlers with `app.route(...)`.
- Test POST/PATCH/DELETE with Postman, next.
