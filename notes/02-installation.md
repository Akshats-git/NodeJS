# 02 — Node.js Installation

[Watch](https://youtu.be/N6PjgN9licA)

A short video on installing and setting up Node.js on your machine. The process is easy and
works the same on Windows and Linux.

## Download it

Go to the official website: [nodejs.org](https://nodejs.org). On the home page you see two
download buttons: **LTS** and **Current**. You need to know which one to pick.

## LTS vs Current

Think of it like most apps. There is a stable production release everyone uses, and there is a
beta release with new but unstable features.

- **LTS** means Long Term Support. This is the stable release. It is safe to use in
  production. The site marks it "Recommended for most users". Always download this one.
- **Current** has the latest features. It is like a beta version. It can be unstable, so do
  not use it in production. Use it only to test out new features.

## The even and odd version rule

Node.js version numbers follow a pattern:

- **Even numbers** (18, 20, ...) become LTS and are stable.
- **Odd numbers** (19, 21, ...) are the current line and are unstable.

Here is how it flows. Say 18 is the current LTS. New features are being tested in 19. When
those features become stable, they ship as 20, which becomes the next LTS. Then 21 starts
testing the next round of features, and so on. So for production, always go with LTS.

## Install

Download the LTS installer and open the setup. Whether you are on Windows or Linux, just click
next, next, accept the terms, and finish. Node.js is now installed.

## Verify the install

Open your terminal and check the version:

```bash
node --version
# or
node -v
```

You will see a version number like `v16.14` or `v18`. The exact number depends on when you
install. As long as you get a number back, Node.js is installed and working.

Once installed, you can run JavaScript with Node, for example printing `2 + 3`.

## npm comes with it

npm is installed automatically along with Node.js. Check its version:

```bash
npm -v
```

You will see something like `8.5.0`.

npm stands for **Node Package Manager**. When you build projects and servers, you need to
install packages and plugins. npm is the tool that manages those packages: installing,
uninstalling, and updating them. You do not install npm separately. It ships with Node.js by
default.

That is it. Node.js and npm are set up and you are ready to go.
