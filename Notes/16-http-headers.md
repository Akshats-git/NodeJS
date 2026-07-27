# 16 — HTTP Headers

[Watch](https://www.youtube.com/watch?v=mhg3Vwsb88M)

HTTP headers are extra information attached to every request and response. (Status codes were
planned for this video too, but they get their own note next.)

## The idea: metadata on an envelope

Think of sending a physical letter. You put the actual message inside the envelope, and on the
outside you write extra information: the from address, the to address, and maybe the weight.
Without that outside information the letter could never be delivered.

An HTTP request or response works the same way. The **body** holds the actual data, and the
**headers** hold extra information about that data: where it came from, where it is going, what
type it is, and how big it is. Headers are **metadata** (data about the data).

## Definition

HTTP headers are an important part of the request and response. They carry metadata about the
request and response body, passing context such as the content type, size, and origin.

## Seeing headers in the browser

Open YouTube in an incognito tab, open the inspector, go to the **Network** tab, and refresh.
Click the main `youtube.com` request. You will see two groups: **Request Headers** (what your
browser sent) and **Response Headers** (what the server sent back).

Common **request** headers the browser sends:

- `Accept` — what response format the client wants (for example `text/html`).
- `Accept-Language` — the device language (for example English). Open YouTube in a region where
  English is not set and it loads in another language, based on this header.
- `User-Agent` — information about the client device and browser (for example that you are on a
  Mac).
- `Cache-Control`, `Cookie`, `Referer`, and more.

Common **response** headers the server sends: `Date`, `Content-Type`, and others relevant to
that site.

## Headers on your own server (via Postman)

Send a request to `http://localhost:8000/api/users` in Postman and open the **Headers** tab for
both request and response.

Request headers Postman sends include its own `User-Agent` (Postman and version), an `Accept`
of `*/*` (meaning it accepts any type), encoding, and connection info.

Interesting response headers from your Express server:

- `X-Powered-By: Express` — Express adds this automatically to advertise that the server runs
  Express. In production it is common to remove it with `app.disable("x-powered-by")`, since
  revealing your stack is a small security concern.
- `Content-Type: application/json` — tells the client the response is JSON. This is how Postman
  knows to render it as JSON.
- `Content-Length` — the size of the response body in bytes.
- `ETag` — an identifier for this version of the response, used for cache validation (the
  client can ask "has this changed?" using it).

## Setting response headers

Set a custom header on the response before sending it:

```js
app.get("/api/users", (req, res) => {
  res.setHeader("X-MyName", "Piyush Garg"); // or res.set("X-MyName", "Piyush Garg")
  return res.json(users);
});
```

After restarting, the response carries the new header.

## Reading request headers

Read the headers the client sent from `req.headers`:

```js
console.log(req.headers);          // all request headers
console.log(req.headers["x-myname"]); // a specific one
```

So you can both read incoming headers and set outgoing ones.

## Custom headers and the X- prefix

An older convention was to prefix a custom header name with `X-` (like `X-MyName`) to mark it as
non-standard, the way Express uses `X-Powered-By`. Standard headers such as `Content-Type`,
`User-Agent`, and `Connection` have no prefix.

That `X-` convention was **deprecated by RFC 6648 (2012)**, because a header often stops being
experimental while the `X-` name sticks around. Modern practice is to use a plain, descriptive
name without `X-`. You will still see `X-` headers everywhere, so it is worth recognizing, but
you do not need to add `X-` to new custom headers.

## Standard headers

There is a fixed set of standard headers (`Content-Type`, `Accept`, `Authorization`, and so
on). MDN and the API docs list them all, along with what each one is for. Many of them come up
as we build features.

## Where headers get used

- **Authentication/authorization** (later videos): after a user logs in, each request carries
  the user's token or id in a header (typically `Authorization`), so the server knows who is
  making the request.
- **Body parsing**: the `express.urlencoded` and `express.json` middleware read the
  `Content-Type` header to decide how to parse the body. If it is
  `application/x-www-form-urlencoded`, the urlencoded parser turns the body into an object on
  `req.body`; if it is `application/json`, the JSON parser handles it; otherwise it calls
  `next()` and does nothing. Postman sets `Content-Type` automatically based on the body type
  you choose, which is why parsing just works.

## Summary

- Headers are metadata attached to every request and response (type, size, origin, and more).
- Read incoming headers from `req.headers`; set outgoing ones with `res.setHeader` / `res.set`.
- `Content-Type` drives how bodies are parsed and rendered.
- The `X-` prefix for custom headers is deprecated (RFC 6648); use a descriptive name instead.
- Headers power things like auth tokens and content negotiation.
