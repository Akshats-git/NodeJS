# 20 — Model View Controller (MVC Pattern)

[Watch](https://www.youtube.com/watch?v=JLtXoru-ipo)

A refactoring video. We reorganize the project using the MVC pattern.

## What MVC is

MVC has three parts:

- **Model** — the data and how it is structured (the Mongoose schemas/models).
- **View** — what the user sees (used later for server-side rendering).
- **Controller** — the logic that handles a request.

The classic flow is: the **controller** manipulates the **model**, and the **model** updates the
**view**. In an Express API this becomes: a **route** points to a **controller**, and the
controller uses a **model** to read or write data.

## The problem

Right now `index.js` holds the schema, the model, the database connection, the middleware, and
all the routes in one file. It is crowded and hard to maintain. With only one model it is
already messy; adding more models would make it much worse. MVC splits this into folders.

## The folder structure

Create these folders:

- `models/` — all schemas and models
- `controllers/` — the handler functions
- `routes/` — the route definitions
- `views/` — templates for later (server-side rendering)

`index.js` becomes a thin entry point that wires everything together.

## Model (models/user.js)

Move the schema and model out of `index.js`:

```js
const mongoose = require("mongoose");

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

const User = mongoose.model("user", userSchema);

module.exports = User;
```

## Controllers (controllers/user.js)

Controllers hold the isolated handler functions that use the model:

```js
const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
  return res.json({ status: "Success" });
}

async function handleDeleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ status: "Success" });
}

async function handleCreateNewUser(req, res) {
  const body = req.body;
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  return res.status(201).json({ msg: "success", id: result._id });
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
```

## Routes (routes/user.js)

Instead of `app`, use an Express **Router** and attach the controller functions. Drop the
`/user` prefix from each path, because we will mount this router at that prefix in `index.js`.

```js
const express = require("express");
const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
} = require("../controllers/user");

const router = express.Router();

router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
```

`express.Router()` creates a separate, isolated router. Here `/` means "the mount point" and
`/:id` means "mount point + id".

## Connection (connection.js)

Move the database connection into its own file, wrapped in a function that takes the URL:

```js
const mongoose = require("mongoose");

async function connectMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = { connectMongoDB };
```

## Middleware (middlewares/index.js)

Move the logging middleware here. Wrap it in a function that takes a filename and returns the
middleware (a closure), so it can be configured:

```js
const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    fs.appendFile(
      filename,
      `\n${Date.now()}: ${req.ip} ${req.method}: ${req.path}\n`,
      (err, data) => {
        next();
      }
    );
  };
}

module.exports = { logReqRes };
```

## The thin index.js

Now `index.js` just imports and wires everything:

```js
const express = require("express");
const { connectMongoDB } = require("./connection");
const { logReqRes } = require("./middlewares");
const userRouter = require("./routes/user");

const app = express();
const PORT = 8000;

// connection
connectMongoDB("mongodb://localhost:27017/youtube-app-1").then(() =>
  console.log("MongoDB connected")
);

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

// routes
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
```

When a request comes to `/api/users`, Express matches that prefix and hands the rest of the path
to `userRouter`. (When importing a folder like `./middlewares`, Node automatically picks up its
`index.js`, so you do not write `/index`.)

## The strictQuery warning

Mongoose 6 prints a deprecation warning about `strictQuery`. Silence it by setting the option
before connecting:

```js
mongoose.set("strictQuery", true);
```

(In Mongoose 7 this default changed and the warning is gone.)

## Why this is better

- The code is organized and maintainable. Each resource has a route, a controller, and a model,
  all linked.
- Adding new resources just means adding more routes, controllers, and models.
- It is easy for teams: to work on the user feature, you touch `routes/user.js`,
  `controllers/user.js`, and `models/user.js`.
- The mount prefix is in one place, so changing `/api/users` to something else is a one-line
  change.

## Summary

- MVC splits the app into **models**, **controllers**, **routes** (and **views** later).
- Models hold schemas; controllers hold handler logic; routes map URLs to controllers via
  `express.Router()`; `index.js` mounts routers with `app.use("/prefix", router)`.
- Keep the connection and middleware in their own files too.
- The result is a clean, maintainable, team-friendly structure. Views come next.
