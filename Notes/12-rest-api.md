# 12 — What is a REST API

[Watch](https://www.youtube.com/watch?v=cJAyEOZQUQY)

An overview of REST. As a backend developer you will hear "REST API," "RESTful API," or just
"REST" constantly. Following these practices makes your server a good, standard one.

## What REST means

REST stands for **REpresentational State Transfer**. It is an architectural style, defined by
Roy Fielding, with **six constraints** for how a client and a server communicate:

1. **Client-Server** (covered below)
2. **Statelessness** (covered below)
3. **Cacheability** (responses should say whether they can be cached)
4. **Layered system** (there can be proxies/load balancers between client and server)
5. **Uniform interface** (consistent, resource-based URLs and proper HTTP methods, which is the
   method rule below)
6. **Code on demand** (optional)

The two constraints you work with most directly are client-server and the uniform interface
(using HTTP methods correctly). Both are covered below, along with statelessness.

## The client and server

- The **server** does the work and holds the data.
- The **client** sends a request; the server returns a response.
- The client can be **anything**: a browser, a mobile phone, or a smart device like Alexa.

The rules of REST govern this request/response communication.

## Client-Server architecture

The server and the client are **different machines** and should **not depend on each other**.

A response can be in different formats: plain text, an image, an **HTML** document, or **JSON**
(JavaScript Object Notation). Which should you send?

### The problem with sending HTML

Suppose a client does `GET` for some blogs. The server fetches them from the database, builds an
**HTML document**, and sends that back.

- If the client is a **browser**, fine, it renders the HTML.
- If the client is a **mobile app** or an **Alexa**, it cannot render HTML.

Also, the server is deciding how the data should look, so the client becomes **dependent** on
the server. REST says this dependency should not exist. (Generating the page on the server like
this is called **Server Side Rendering**, covered below.)

### The solution: send raw data (JSON)

Instead, send **raw data** as JSON (key-value pairs, and arrays, and nesting). The client reads
the JSON and renders it however it wants on its own screen. Now there is no dependency: the
server just fetches data and returns JSON, and the client (React, a browser, a Flutter mobile
app, anything) decides how to display it.

Older systems used **XML** for this; today JSON is the common choice. REST does not strictly
require JSON, though. A resource can have multiple representations (JSON, XML, HTML, ...), and
the client and server pick one using `Accept` / `Content-Type` headers (content negotiation).
JSON is simply the popular default.

### When HTML is fine

If you **know** the client is always a browser (for example `google.com` is always viewed in a
browser), sending HTML is a good choice. It is fast, needs no processing on the client, and the
data shows up immediately. But if your app is **cross-platform** (browser plus mobile plus
others), send JSON and let each frontend handle display.

## Respect all HTTP methods (uniform interface)

Use each HTTP method for what it is meant to do, and name routes by the **resource**, not by the
action.

```
GET    /user   -> return the users' data
POST   /user   -> create a new user
PATCH  /user   -> update the user
DELETE /user   -> delete the user
```

Do **not** do things like `POST /createUser` or `POST /deleteUser`. That is redundant and
confusing, because the method already says the action. If you send a GET, you are getting, so do
not also put a verb like "get" in the URL. Keep URLs about the resource (`/user`), and let the
method express the action.

Many developers ignore this and only ever use GET (to fetch) and POST (for everything else,
including updates and deletes). That works, but it is not RESTful. In this series we respect the
methods properly.

## Statelessness

Each request from the client must contain **all** the information the server needs to handle it.
The server does **not** store client session state between requests. This is why REST APIs send
credentials/tokens on every request rather than relying on a remembered server-side session. It
also makes servers easy to scale, because any server instance can handle any request.
Authentication and authorization (later videos) build on this idea.

## Server Side Rendering vs Client Side Rendering

- **Server Side Rendering (SSR):** the server builds the HTML and sends the rendered page. In
  Express this is `res.render(...)`.
- **Client Side Rendering (CSR):** the server sends JSON, and the client (like React) renders it
  itself. In Express you send JSON with `res.json(...)` (or `res.send(...)`).

Neither is inherently more secure than the other; both can be secure or insecure. SSR's real
advantages are a **faster first paint** (content is ready as soon as it arrives) and better
**SEO**. CSR shows a blank page first, then fetches and renders, so the first load can feel
slower, but after loading, in-app navigation can be faster because there is no full page reload.
It is a trade-off, not simply "SSR fast, CSR slow."

## In Express

- `res.json(obj)` sends a JSON response.
- `res.send(...)` sends text/HTML/JSON (it sets the content type for you).
- `res.render(...)` renders an HTML template (SSR).

## What this series does

In this Node part of the course, we will:

1. Send **HTML** (since our client will be a browser for now). Later, when we do React, we will
   send **JSON**.
2. **Respect the HTTP methods** (GET/POST/PUT/PATCH/DELETE) for what they mean.

Do both and you can call your API RESTful.

## Summary

- REST = REpresentational State Transfer, an architectural style with six constraints.
- Keep client and server independent; prefer sending raw data (JSON) unless the client is always
  a browser.
- Use HTTP methods for their real meaning and name routes by resource, not action.
- Remember **statelessness**: every request carries all it needs; the server keeps no session
  state between requests.
- SSR (`res.render`) vs CSR (`res.json`) is a trade-off, not simply fast vs slow.
