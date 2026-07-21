# 03 — Hello World

[Watch](https://www.youtube.com/watch?v=XhCs5cTYW_8)

Our first Node.js program. We write a Hello World, run it, and learn a few important things
along the way.

## Set up the folder

Make an empty folder for the whole course. Name it anything, for example `nodejs`. Inside it,
make a new folder for this lesson, like `01-hello-world`. Keeping one folder per lesson makes
it easy to track what each piece of code is doing.

Open the folder in your code editor (VS Code is used here). Remember, Node.js is a runtime
environment for JavaScript.

## Write and run the file

Create a new file called `hello.js`. The `.js` extension marks it as a JavaScript file. Inside
it, write a simple line:

```js
console.log("Hey there, I am JS");
```

Open the integrated terminal and run it with Node:

```bash
node hello.js
```

You can also skip the extension, because Node knows these are JavaScript files:

```bash
node hello
```

Both run the same file.

## What is not available in Node

Node.js is JavaScript, but it is not the browser. Some things you have in the browser are
missing here.

Try this in `hello.js`:

```js
console.log(window);
```

Run it and you get an error: `window is not defined`. The same happens with `alert`:

```js
alert("hey");   // alert is not defined
```

But a plain string works fine:

```js
console.log("hello");   // works
```

Now open a browser and go to its inspector console. There, `window` prints the window object,
and `alert` works. So why the difference?

In Node you do not have the `window` object, `document`, `getElementById`, `navigator`, and
similar browser APIs. Node keeps only the core functionality you need on the server side.

The reason is that `window`, `document`, `alert`, and the rest are **Web APIs** that the
browser adds on top of V8. They were never part of V8 or of JavaScript itself. V8 only provides
the core JavaScript language. The browser supplies those APIs, and Node simply does not,
because there is no browser. Node instead supplies its own server-side APIs on top of the same
V8 engine.

## Server-side APIs Node adds

On top of V8, Node adds the server-side APIs a program needs, for example:

- Cryptography (encrypting data, hashing)
- Working with packages
- File handling

So Node does not include the browser-only APIs, and it adds the parts a server needs.

## npm and package.json

Recall that installing Node also installs npm. Check it:

```bash
npm -v
```

npm stands for **Node Package Manager**.

When you start a real project, you first initialize it:

```bash
npm init
```

`init` means initialize. This command builds a template for you and creates a file used to run
your project. It asks a few questions:

- **package name** (defaults to the folder name, like `hello-world`)
- **version** (like `1.0.0`)
- **description**
- **entry point** (defaults to `hello.js`, picked automatically since it is the only file)
- **test command**, **git repository**, **keywords**, **author**, **license**

Press enter through them and a new file is created: `package.json`.

### What package.json is

`package.json` is the configuration file for your project. Everything about the project lives
here: the dependencies you install, details for when you publish, and how you run the code. You
could write this file by hand, but that risks mistakes, so `npm init` generates it for you.

### Scripts

`package.json` has a `scripts` section where you can write your own commands. For example, a
script named `start`:

```json
{
  "scripts": {
    "start": "node hello.js"
  }
}
```

Then run:

```bash
npm start
```

This starts your whole project. It makes sense because in production you have many files, and
before the app starts you may need to do setup work like connecting to a database or cleaning
things up. Instead of doing all that by hand every time, you put it in the start script and
just run `npm start`.

## Summary

- You can run a simple `.js` file in Node with `node file.js`.
- Browser things like the `window` object are not available in Node.
- `npm init` creates `package.json`, the project's configuration file.
- In `package.json` you write your own scripts, name your app, and manage dependencies, which
  we will cover in the coming videos.
