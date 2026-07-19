# 04 — Modules in NodeJS

[Watch](https://www.youtube.com/watch?v=FSRo41TaHFU)

## What modular programming is

In the production world, you do not keep all your code in one file. You divide the whole
codebase into small pieces called modules. This is modular programming.

Every file in Node is a module. Your `hello.js` file is a module that holds some code. In real
projects you have many functions and a lot going on, so you split the code into small modules.
This keeps things easy to track and manage.

## Splitting code into a file

Say `hello.js` has an `add` function:

```js
function add(a, b) {
  return a + b;
}

console.log(add(3, 4)); // 7
```

To keep math code separate, make a new file `maths.js` and move all math related functions
there. Cut `add` out of `hello.js` and paste it into `maths.js`.

Now `hello.js` breaks with `add is not defined`, which is correct, because `add` moved into
`maths.js`. So how do you use the `maths.js` module inside `hello.js`?

## The require function

Node gives you a built-in `require` function to bring one module into another. It is like
`import` in Java or `#include` in C and C++. This function exists only in Node, not in plain
JavaScript.

```js
const math = require("./maths");
```

### Why the ./ matters

The `./` means the current directory. You must use it for your own files.

If you write `require("maths")` without `./`, you get `module not found`. That is because
`require` then looks inside installed packages and Node's built-in packages, not your current
folder. For example `require("buffer")` pulls in the built-in buffer package.

Since `maths.js` is your own file in the current folder, you write `./maths`.

## Exporting from a module

After `const math = require("./maths")`, log it:

```js
console.log(math); // {}
```

You get an empty object, and `math.add` is not defined. Why? A function you write is private
to its module. To use it elsewhere, you must export it and make it public.

Every module has a `module` object with a `module.exports` property. It is empty by default.
Whatever you assign to `module.exports` is what gets exported.

```js
module.exports = "Piyush";   // now math === "Piyush"
module.exports = add;        // now math is the add function, call math(2, 4)
```

### Exporting more than one thing

You cannot export two things by assigning `module.exports` twice. The second assignment
overrides the first, so the earlier value is lost:

```js
module.exports = add;
module.exports = subtract; // add is now gone
```

To export multiple things, assign an object:

```js
// maths.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };
```

Now the import is an object with both functions:

```js
// hello.js
const math = require("./maths");

console.log(math.add(2, 4));      // 6
console.log(math.subtract(2, 4)); // -2
```

### Destructuring the import

You can pull the functions out directly:

```js
const { add, subtract } = require("./maths");

console.log(add(2, 4));      // 6
console.log(subtract(2, 4)); // -2
```

## The other way: exports

There is a second way to export, using the `exports` object and adding properties to it:

```js
// maths.js
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;
```

This is called multiple exports. `module.exports = ...` is the single or default export.

One detail: with `module.exports = { add, subtract }` the functions keep their names. With the
`exports.add = (a, b) => ...` arrow style, the functions are anonymous. They are just
properties named `add` and `subtract` holding unnamed functions.

`module.exports` can be used only once, because it overrides the value. With `exports` you can
add as many properties as you want.

### Which one to use

It depends on the use case. If you have a file where many functions run down the page, using
`exports` is fine and is a good practice. The instructor personally prefers writing all the
functions at the top and then exporting them together in `module.exports` at the end.

## Built-in modules

Node ships with many built-in packages and modules that you can use without installing
anything. In your editor, pressing Ctrl+Space (or Cmd on a Mac) after `require(` shows their
names. A few examples:

- `http` to build web servers (covered in an upcoming video)
- `fs` (file system) for file handling (covered next)
- `crypto` for cryptography, like hashing and encryption

The lookup rule is the same as before:

- A name that starts with `./` is searched in your current project directory.
- A plain name like `fs` or `http` is searched in Node's built-in packages and any external
  packages you installed.

So `require("./fs")` fails because there is no `fs` file in your folder, but `require("fs")`
works and gives you many file system functions. These built-in modules came with Node when you
installed it, so you do not install them separately.

## Summary

- Modular programming splits your code into small modules (files).
- Use `require` to import a module. Start with `./` for your own files.
- Assign `module.exports` for a single or default export.
- Use `exports.name` or `module.exports = { ... }` to export multiple things.
- Node has powerful built-in modules like `fs`, `http`, and `crypto`.

We will use modules in every program from here on, require many packages, and later install
third party packages too.
