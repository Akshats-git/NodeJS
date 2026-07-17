# 01 — What is NodeJS?

[Watch](https://www.youtube.com/watch?v=ohIAiuHMKMI) · Code: [1.hello.js](../1.hello.js)

## The main question

People know Node.js is used to build things, but they are not sure what it is.
Is it a framework? Is it a library? Or is it something else? This video answers that.

## JavaScript is a browser language

JavaScript was made to run inside the browser. We use it to make web pages interactive.
Normally you write JavaScript and the browser runs it. On its own, JavaScript could not run
outside the browser.

The reason is the JavaScript engine. Every browser ships with its own engine. When you
download a browser, its JavaScript engine comes with it. When you run JavaScript on a page,
that engine reads and executes the code. But the engine lived only inside the browser, so
the language could only run there.

## Every browser has its own engine

Each browser uses a different engine, so the same code can behave a little differently across
browsers.

| Browser | JavaScript engine |
| --- | --- |
| Chrome | V8 |
| Firefox | SpiderMonkey |
| Safari | Apple's engine (JavaScriptCore) |

V8 is the most popular engine. It powers Chrome and other Chromium browsers.

## How Node.js was made

V8 is written in C++. Someone took the V8 engine out of Chrome and combined it with C++ code.
Now the engine works on its own, without a browser.

C++ is a native language. It can do machine level work like reading and writing files or
looking at the storage on your computer. Because Node.js pairs V8 with C++, two things become
possible:

1. You can run JavaScript outside the browser.
2. Your JavaScript can talk to the machine. You can handle files, read storage, and do other
   tasks that C++ can do at the machine level.

So Node.js is the environment that runs your JavaScript. The V8 engine inside it executes the
code, and the C++ layer gives it access to the machine.

## So what is Node.js?

Node.js is a runtime environment for JavaScript. It is not a framework. It is not a library.
It is simply an environment where you can run JavaScript.

Website: [nodejs.org](https://nodejs.org). It is open source and cross platform.

## Quick demo

Inside the browser console, `console.log("hello")` prints `hello`, and `2 + 3` prints `5`.
The V8 engine in the browser runs this.

If you paste the same code straight into your machine, it will not run, because the machine
has no JavaScript engine by itself. After you install Node.js, you can run it. Type `node` to
open the interactive terminal (the REPL):

```bash
node
```

```js
console.log("hello from JS"); // hello from JS
2 + 5                          // 7
```

Now the same JavaScript runs in your terminal, outside the browser. Node.js is what makes
this possible.

## Before you start

Learn JavaScript first. Most of the code in this series is plain JavaScript. The next video
covers how to install Node.js on your machine.
