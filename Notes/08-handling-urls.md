# 08 — Handling URLs

[Watch](https://www.youtube.com/watch?v=Nt-AsZh5woE)

What a URL is, its parts, and how to read the path and query parameters in a Node server.

## What is a URL

URL stands for **Uniform Resource Locator**. It is the human-friendly address of a resource on
the web. If you want to be a web developer, you should know how a URL works and what its parts
are.

## The parts of a URL

Take an example: `https://www.google.com/search?q=javascript`.

### 1. Protocol

`https://` is the **protocol**. A protocol is a set of rules for how the browser communicates
with the server.

- **HTTPS** means HyperText Transfer Protocol Secure. Requests and responses are encrypted,
  using an SSL certificate.
- **HTTP** has no SSL certificate and is less secure.
- There are other protocols too, like **WebSocket** (`ws`) for real-time communication.

### 2. Domain

`www.google.com` is the **domain**. It is a user-friendly name for the server's **IP address**.

Every server (every website) has an IP address, but IPs are hard to memorize. So you buy a
domain and point it to the IP. Then people use the readable name instead of the numbers. You
can see a site's IP yourself:

```bash
nslookup google.com
```

Paste the returned IP into the browser and Google opens. The domain just maps to that IP.

### 3. Path

The part after the domain is the **path**. Examples:

- `/` is the **root path**, also called the home page.
- `/about`, `/contact-us` are simple paths.
- `/project/1`, `/project/2` are **nested paths**.

The path tells the server which resource you want, so it can respond accordingly.

### 4. Query parameters

Anything after a `?` is the **query parameters**. These are extra pieces of information you send
along with the URL. They are `key=value` pairs, joined by `&`.

Example: `/about?userId=1&a=2`

- The path is `/about`.
- `userId=1` and `a=2` are two query parameters.

Real examples:

- Google: `google.com/search?q=javascript+interview+questions`. Here `q` (for query) holds your
  search text. Spaces become `+` because a URL cannot contain spaces.
- YouTube: `youtube.com/results?search_query=javascript`. Here the key is `search_query`.

The server reads `/search`, takes the `q` value, searches its database, and renders the
results. That is how search works.

## The problem in the http module

`req.url` gives you the path **including** the query string, for example `/about?myname=Piyush`.
It does **not** split the query off for you. So a `switch (req.url)` with `case "/about"` will
not match, because `req.url` is the whole `/about?myname=Piyush` string.

You need to parse the URL to separate the path from the query.

## Parsing the URL

Node has a **built-in `url` module**, so you do not install anything to parse a URL. The legacy
way uses `url.parse`:

```js
const url = require("url");

const myUrl = url.parse(req.url, true);
console.log(myUrl);
```

- `myUrl.pathname` is the clean path, like `/about`.
- `myUrl.query` is the query. With the second argument set to `true`, it is parsed into an
  **object** (like `{ myname: "Piyush", userId: "1" }`). Without `true`, it stays a string.

Then you switch on `myUrl.pathname` instead of `req.url`.

`url.parse()` is the legacy API and is now deprecated. The modern, recommended way is the
**WHATWG `URL`** class with `URLSearchParams`. Since `req.url` is only a path (no protocol or
host), give `new URL` a base:

```js
const myUrl = new URL(req.url, `http://${req.headers.host}`);
myUrl.pathname;                    // "/about"
myUrl.searchParams.get("myname");  // "Piyush"
```

Because `req.url` is a relative path on localhost, it has no protocol or host of its own, so a
parsed `protocol` and `host` come out as `null`.

## Putting it together

```js
const http = require("http");
const fs = require("fs");
const url = require("url"); // built-in, no install needed

const myServer = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") return res.end();

  const log = `${Date.now()}: ${req.url} New request received\n`;
  const myUrl = url.parse(req.url, true);

  fs.appendFile("log.txt", log, (err) => {
    switch (myUrl.pathname) {
      case "/":
        res.end("Home page");
        break;
      case "/about": {
        const username = myUrl.query.myname;
        res.end(`Hi, ${username}`);
        break;
      }
      case "/search": {
        const search = myUrl.query.search_query;
        res.end("Here are your results for " + search);
        break;
      }
      default:
        res.end("404 Not Found");
    }
  });
});

myServer.listen(8000, () => console.log("Server started"));
```

Now `/about?myname=Piyush` still routes to the `/about` case (because we switch on
`myUrl.pathname`), and you can read `myUrl.query.myname` to get `Piyush`. A `/search?search_query=javascript`
request reads `myUrl.query.search_query`. This is exactly how Google and YouTube handle their
`q` and `search_query` parameters.

## node_modules and npm install

When you install a package, npm does two things:

- Adds it to the `dependencies` in `package.json` (with a version like `"url": "^0.11.0"`).
- Downloads the actual package code into a `node_modules` folder.

If you delete `node_modules`, you do not lose your setup. Just run:

```bash
npm install
```

npm reads the dependencies from `package.json` and reinstalls them. This is why the dependency
list in `package.json` matters. (You do not commit `node_modules`; you reinstall it from
`package.json`.)

## Summary

- A URL is **protocol + domain + path + query parameters**.
- The domain is a friendly name for an IP address.
- Query parameters start after `?`, are `key=value`, and are joined by `&`.
- In the `http` module, `req.url` includes the query string, so parse it to separate the path
  from the query. Prefer the built-in `URL` class over the deprecated `url.parse`.
- Route on the pathname, then read query values to talk to your database and send a response.
