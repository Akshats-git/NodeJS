# 02 — Node.js Installation

[Watch](https://youtu.be/N6PjgN9licA)

A short video on installing and setting up Node.js on your machine. The process is easy and
works the same on Windows and Linux.

## Download it

Go to the official website: [nodejs.org](https://nodejs.org). On the home page you see two
download buttons: **LTS** and **Current**. You need to know which one to pick.

## LTS vs Current

The two buttons are two different release lines, not stable versus broken. Both are production
quality and pass the same tests. The difference is the support window and how new the features
are.

- **LTS** means Long Term Support. It gets a long support window (about 30 months of fixes and
  security updates). The site marks it "Recommended for most users". For most projects,
  download this one.
- **Current** has the latest features and a much shorter support window. Newer features can
  include breaking changes. Use it if you want the newest additions or want to test them early.

LTS is the safer default for production mainly because of its long, predictable support, not
because Current is unstable.

## The even and odd version rule

Node.js version numbers follow a pattern based on the **support track**, not on stability:

- **Even numbers** (18, 20, ...) eventually move to the **LTS** track.
- **Odd numbers** (19, 21, ...) reach end of life and never become LTS.

Every major version, even or odd, first ships as **Current** for about six months. After that,
even-numbered versions transition to LTS, while odd-numbered versions are retired. Odd releases
are not unstable during their life; they just are not kept around long term.

Here is how it flows. A new major like 21 ships as Current. An even one like 20 spends its
first months as Current, then becomes the active LTS. So for production you usually want the
latest **even** version once it is on the LTS track.

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
