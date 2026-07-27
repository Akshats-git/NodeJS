# 17 — HTTP Status Codes

[Watch](https://www.youtube.com/watch?v=fLGw2GK884s)

Every response carries a status code that tells the client how the request went. The famous one
is `404 Not Found`.

## The five categories

Status codes are grouped by their first digit (see the MDN list of HTTP response status codes):

- **1xx — Informational** (100-199)
- **2xx — Success** (200-299): the request worked. This is what you want.
- **3xx — Redirection** (300-399): the client needs to go somewhere else.
- **4xx — Client error** (400-499): the server is fine, but the client made a mistake (wrong
  password, missing data, a URL that does not exist).
- **5xx — Server error** (500-599): the server made a mistake (a bug, could not reach the
  database, could not process the request).

## Quick reference: commonly seen codes

| Code | Name                  | Meaning                                                        |
| ---- | --------------------- | ------------------------------------------------------------- |
| 200  | OK                    | Request succeeded.                                            |
| 201  | Created               | A new resource was created (use for POST).                   |
| 202  | Accepted              | Accepted for processing, not finished yet.                   |
| 204  | No Content            | Succeeded, but no body to return.                            |
| 301  | Moved Permanently     | Resource permanently moved to a new URL.                    |
| 302  | Found                 | Temporary redirect to another URL.                          |
| 304  | Not Modified          | Cached copy is still valid; nothing changed.                |
| 400  | Bad Request           | Malformed request or missing/invalid data.                  |
| 401  | Unauthorized          | Not authenticated (not logged in).                          |
| 403  | Forbidden             | Authenticated but not allowed to do this.                   |
| 404  | Not Found             | Resource or route does not exist.                           |
| 405  | Method Not Allowed    | The HTTP method is not supported on this route.             |
| 409  | Conflict              | Conflicts with current state (e.g. duplicate resource).     |
| 422  | Unprocessable Entity  | Well-formed but fails validation.                           |
| 429  | Too Many Requests     | Rate limit exceeded.                                        |
| 500  | Internal Server Error | A bug or failure on the server.                             |
| 502  | Bad Gateway           | An upstream server returned an invalid response.            |
| 503  | Service Unavailable   | The server is down or overloaded.                           |

## 2xx — Success

- **200 OK** — the request succeeded. The default for a successful route.
- **201 Created** — a new resource was created. Use this for a POST that creates something,
  instead of a plain 200.
- **202 Accepted** — the request was accepted for processing but is not finished yet.
- **204 No Content** — the request succeeded, but there is no body to return. For example, you
  acknowledge success without sending data back.

## 3xx — Redirection

Used when the client should be sent elsewhere. Common in URL shorteners (like bit.ly) and when
redirecting a user to a payment page. We use these when we build the URL shortener project
later.

## 4xx — Client error

- **400 Bad Request** — the payload is malformed or missing required data.
- **401 Unauthorized** — not authenticated (not logged in). Despite the name "Unauthorized," it
  really means the client has not proven who it is.
- **402 Payment Required** — reserved for future use, intended for payment-related cases (for
  example, credits exhausted).
- **403 Forbidden** — authenticated, but not allowed to perform this action (no permission).
- **404 Not Found** — the resource or route does not exist. Express sends this automatically for
  unknown routes, and you can also send it yourself when a requested record is missing.
- **405 Method Not Allowed**, **406 Not Acceptable** — more client errors.

The practical distinction: **401** means "you are not logged in," and **403** means "you are
logged in but not allowed."

## 5xx — Server error

- **500 Internal Server Error** — a bug or failure on the server (for example, reading a
  property of `undefined`, or a database error). Express returns 500 automatically when a
  handler throws.
- **501 Not Implemented** — the endpoint is not implemented yet.
- **503 Service Unavailable** — the service is down.

## Setting the status in Express

Use `res.status(code)`, which is chainable:

```js
res.status(201).json({ status: "success" });
```

## Validation example (400 and 201)

Reject a create request that is missing required fields, and return 201 on success:

```js
app.post("/api/users", (req, res) => {
  const body = req.body;

  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const id = users.length + 1;
  users.push({ ...body, id });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    return res.status(201).json({ status: "success", id });
  });
});
```

Send an incomplete body and you get `400 Bad Request`; send the full body and you get
`201 Created`.

## Not found example (404)

When the requested user does not exist, return 404 instead of an empty 200:

```js
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json(user);
});
```

A valid id returns `200` with the user; a missing one returns `404 User not found`.

## Server errors (500)

If your handler throws, for example by treating an object as an array
(`user[0]` when `user` is a single object), Express responds with `500 Internal Server Error`.
Any unhandled code or logic error becomes a 500. Fix the bug and the route returns 200 again.

## Bonus: nodemon for auto-restart

Restarting the server after every change is tedious. **nodemon** watches your files and restarts
the server automatically on save. Install it (commonly as a dev dependency) and run it instead
of `node`:

```bash
npm install --save-dev nodemon
```

Add a script and use it:

```json
{
  "scripts": {
    "dev": "nodemon index.js"
  }
}
```

```bash
npm run dev
```

Now saving a file restarts the server for you.

## Summary

- 1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error.
- Use **200** for success, **201** for created, **400** for bad input, **401/403** for
  auth/permission, **404** for not found, **500** for server bugs.
- Set the code with `res.status(code).json(...)`.
- Use `nodemon` to auto-restart the server during development.
