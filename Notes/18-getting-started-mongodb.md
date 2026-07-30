# 18 — Getting Started with MongoDB

[Watch](https://www.youtube.com/watch?v=oH0VoYiA8_s)

We start using a real database: MongoDB.

## What MongoDB is

MongoDB is a **NoSQL, document-based** database. Broadly, databases come in two families: SQL
(relational, table-based) and NoSQL. MongoDB is NoSQL.

- It stores data as **documents**, which look like JSON objects.
- Internally it stores them in **BSON** (Binary JSON), a binary form of JSON.
- Because documents map naturally to JavaScript objects, MongoDB is very commonly used with
  Node.js (it is the "M" in the MERN and MEAN stacks).

## Architecture

The structure has three levels:

- **Database** — the top-level container.
- **Collections** — like tables in SQL. For example a `users` collection, a `posts` collection,
  a `blogs` collection.
- **Documents** — the actual entries inside a collection, like rows in SQL. A collection can
  hold thousands of documents.

So: **Database → Collections → Documents**. If you know SQL, think collection = table, document
= row, field = column.

## Installation

Search "MongoDB install" and open the **MongoDB Community Edition** install page. Pick your
platform: Linux, macOS, or Windows.

### macOS (Homebrew)

```bash
brew tap mongodb/brew
brew update
brew install mongodb-community
```

This is a large download and can take 25-30 minutes depending on your internet. You can pin a
version (for example `mongodb-community@6.0`) or install the current release.

### Windows

Download the `.msi` installer from the install page and run it (next, agree, next), just like
any Windows install.

## Starting the MongoDB service

Start the MongoDB server (the `mongod` daemon). On macOS with Homebrew:

```bash
brew services start mongodb-community
```

Once the service is running, you can interact with your local MongoDB, which listens on the
default port **27017**.

## The MongoDB shell (mongosh)

Open the shell:

```bash
mongosh
```

This connects you to the local server and shows the shell and server versions. `mongosh` is the
modern MongoDB shell (it replaced the old `mongo` shell).

## Common shell commands

```js
show dbs            // list all databases
use dev             // select/switch to a database (created on first write if new)
show collections    // list collections in the current database
db.users.find()     // list all documents in the users collection
db.users.insertOne({ name: "Piyush", email: "piyush@example.com" }) // insert one document
```

- `show dbs` lists the databases on your machine. A `test` database is selected by default.
- `use <name>` switches the active database.
- `db.<collection>.find()` returns the documents in a collection.
- `db.<collection>.insertOne(...)` / `insertMany(...)` add documents. (The older `insert()`
  still works but `insertOne`/`insertMany` are the current methods.)

## A cloud alternative: MongoDB Atlas

Installing locally is one path. Many people instead use **MongoDB Atlas**, MongoDB's hosted
cloud service. It has a free tier, needs no local install, and gives you a connection string you
can use from your app. Either the local install or Atlas works for the rest of the course.

## What's next

Next we connect MongoDB to the Node app, so every read and write goes to the database instead of
the JSON file. Creating a user will insert a document, deleting a user will remove one, and all
reads and updates will run against the database. This unlocks much more than the flat file we
were using.

## Summary

- MongoDB is a NoSQL, document database that stores JSON-like documents as BSON.
- Structure: **Database → Collections → Documents** (collection = table, document = row).
- Install Community Edition (Homebrew on macOS, MSI on Windows), start the service, and use
  `mongosh` to interact.
- Key shell commands: `show dbs`, `use <db>`, `show collections`, `find()`, `insertOne()`.
- MongoDB Atlas is a cloud alternative that avoids local installation.
