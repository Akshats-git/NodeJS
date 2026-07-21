# 09 — HTTP Methods

[Watch](https://www.youtube.com/watch?v=kREAjKyPbSI)

HTTP methods tell the server what kind of action a request wants to do. The main ones are
**GET, POST, PUT, PATCH, and DELETE**.

## GET

GET means you want to **get some data** from the server. When a GET request arrives, the server
reads data (usually from a database) and sends it back to the client.

Your browser makes a **GET request by default** when you type a URL and press enter, or click a
link. So the browser is essentially a tool for getting data.

**Proof:** Open YouTube, search for something, open the inspector, go to the **Network** tab,
and refresh. Open the main request and you will see `Request Method: GET`. Any page you open in
the address bar is a GET.

## POST

POST means you want to **send data to the server**, usually to create or change something.
"Mutation" means changing or adding data.

The classic example is forms: sign up, sign in, feedback. You type data into the form and
submit it. The browser makes a POST request and sends the form data in the request **body**.
The server sees it is a POST, reads the form data, and inserts it into the database.

**Proof:** Open `facebook.com`, open the inspector Network tab, type an email and password, and
click login. Open that request and you will see `Request Method: POST`, with your form data
(email, etc.) in the request. HTML forms can use POST to send data.

## PUT, PATCH, DELETE

- **PUT** replaces or fully updates a resource at a known address. It is idempotent (calling it
  twice leaves the same result). It is not about file uploads; file uploads are normally done
  with POST using `multipart/form-data`.
- **PATCH** partially updates an existing resource (only the fields that changed), like changing
  your name on an existing profile.
- **DELETE** removes a resource, like deleting your account. It is idempotent.

For contrast, **POST** creates a new resource (the server usually assigns the new id) and is not
idempotent, so calling it twice creates two records.

**Idempotency** matters: GET, PUT, and DELETE are idempotent, and GET is also "safe" (it should
not change anything on the server). POST and PATCH are not guaranteed idempotent. This becomes
important when we build REST APIs in later videos.

## Most common: GET and POST

In practice, GET and POST are the most common: **GET to get data**, **POST to send data** to
the server.

## Handling methods in a Node server

The request method is available on `req.method`. So you route on **both** the path and the
method: switch on the path, then check `req.method` inside each case.

```js
switch (myUrl.pathname) {
  case "/":
    // a home page only makes sense as a GET
    if (req.method === "GET") res.end("You are on the home page");
    break;

  case "/signup":
    if (req.method === "GET") {
      res.end("This is a signup form");
    } else if (req.method === "POST") {
      // read the form data, insert into the database
      res.end("Success");
    }
    break;

  default:
    res.end("404 Not Found");
}
```

- On `/` a GET makes sense; there is no point in a POST to the home page.
- On `/signup`, a **GET** renders the form, and a **POST** (form submission) takes the data,
  saves it to the database, and then responds or redirects the user.

So each path can support multiple methods, and each method does a different thing.

The browser makes a GET when you type a URL in the address bar or click a link. A form
submission can be GET or POST depending on the form's `method` attribute. Plain HTML forms only
support GET and POST. To send PUT, PATCH, or DELETE you use JavaScript (`fetch` or `XHR`), or a
tool like Postman.

## Why this does not scale

Doing this by hand gets messy fast. In a real app you would have many paths, and inside each
one a stack of `if/else` checks for GET, POST, PUT, PATCH, and DELETE. Code maintainability and
structure drop to near zero.

This is exactly the problem **Express** solves. Express is a framework that makes routing and
method handling clean and structured. We move to it in a later video. For now, the goal is to
understand the low-level mechanics.

## Summary

- HTTP methods: **GET** (get data), **POST** (send/create data), **PUT** (replace/update),
  **PATCH** (partial update), **DELETE** (remove).
- The browser defaults to GET for address-bar navigation and links; forms can POST.
- In Node, read the method from `req.method` and combine it with the path to decide what to do.
- GET, PUT, DELETE are idempotent; GET is safe. POST and PATCH are not guaranteed idempotent.
- Hand-writing this does not scale, which is why we later use Express.
