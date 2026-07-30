# 19 — Connecting NodeJS with MongoDB (Mongoose + Express)

[Watch](https://www.youtube.com/watch?v=xrglM8U0Zv8)

We connect the Node app to MongoDB so all reads and writes go to the database instead of the
JSON file. The `fs`-based reading and writing goes away.

## Prerequisite

Make sure the MongoDB service is running. Check with `mongosh`; it connects to the local server
on `127.0.0.1:27017`.

## Install Mongoose

```bash
npm install mongoose
```

**Mongoose** is a package that connects Node.js to MongoDB. It is an ODM (Object Data Modeling)
library: you define the shape of your data in code and use it to talk to the database.

```js
const mongoose = require("mongoose");
```

## The Mongoose workflow

There are three steps:

1. **Schema** — defines the structure of your data.
2. **Model** — created from the schema.
3. **CRUD** — use the model to create, read, update, and delete documents.

## Define the schema

```js
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    jobTitle: { type: String },
    gender: { type: String },
  },
  { timestamps: true }
);
```

- `type` is the field type, written with a capital (`String`).
- `required: true` makes the field mandatory. Leave it out and the field is optional (so
  `lastName` here is optional).
- `unique: true` creates a unique index, so the same email cannot be stored twice. A duplicate
  insert fails with a duplicate-key error (`E11000`).
- `{ timestamps: true }` tells MongoDB to automatically track `createdAt` and `updatedAt` on
  every document.

## Create the model

```js
const User = mongoose.model("user", userSchema);
```

- The first argument is the model name (`"user"`).
- Mongoose automatically turns it into the collection name by lowercasing and pluralizing it,
  so the collection becomes **`users`**.
- Use this `User` model to interact with the database.

## Connect to MongoDB

```js
mongoose
  .connect("mongodb://localhost:27017/youtube-app-1")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error", err));
```

- The connection string is `mongodb://localhost:27017/<dbName>`. The database is created on the
  first write if it does not exist.
- `connect` returns a promise, so handle success with `.then` and failure with `.catch`.

## CRUD operations

Because these calls are asynchronous, the route handlers become `async` and use `await`. Wrap
database calls in `try/catch` (or error-handling middleware) in real code.

### Create (POST)

Replace the old "push to array + `fs.writeFile`" with `User.create`:

```js
app.post("/api/users", async (req, res) => {
  const body = req.body;
  // ...validate required fields, return 400 if missing...

  await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  return res.status(201).json({ msg: "success" });
});
```

(The request sends snake_case fields like `first_name`, which we map to the schema's camelCase
fields.)

### Read all (GET)

```js
const allDbUsers = await User.find({}); // {} means "all documents"
```

Then map over them, for example to build HTML:

```js
const html = `
  <ul>
    ${allDbUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
  </ul>
`;
```

### Read one (GET by id)

MongoDB gives each document a unique `_id`. Fetch by it with `findById`:

```js
const user = await User.findById(req.params.id);
```

### Update (PATCH)

```js
await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
return res.json({ status: "success" });
```

By default `findByIdAndUpdate` returns the document as it was **before** the update. Pass
`{ new: true }` as a third argument to get the updated document back.

### Delete (DELETE)

```js
await User.findByIdAndDelete(req.params.id);
return res.json({ status: "success" });
```

## Documents, _id, and timestamps

- MongoDB auto-generates a unique **`_id`** (an ObjectId) for every document.
- With `{ timestamps: true }`, each document also has `createdAt` and `updatedAt` maintained
  automatically.
- A duplicate email (because of `unique: true`) returns a duplicate-key error, which you can
  surface as "email already exists".

## What's next

The `index.js` file is getting crowded with schema, model, connection, and all the routes mixed
together. The next video refactors it using the **MVC pattern** (industry standard), and then we
start building full projects.

## Summary

- Use **Mongoose** to connect Node to MongoDB: `npm install mongoose`, then `mongoose.connect`.
- Workflow: define a **Schema**, build a **Model**, use the model for **CRUD**.
- Model name is pluralized/lowercased into the collection name.
- CRUD methods: `User.create`, `User.find`, `User.findById`, `User.findByIdAndUpdate`,
  `User.findByIdAndDelete` (all async).
- `{ timestamps: true }` adds `createdAt`/`updatedAt`; MongoDB adds `_id` automatically.
