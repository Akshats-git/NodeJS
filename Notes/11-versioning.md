# 11 — How Versioning Works

[Watch](https://www.youtube.com/watch?v=ORmB_ABimjM)

Versioning looks basic but it matters a lot, including for security. Getting it wrong can even
get your server broken or hacked.

When you install a dependency, its name and version show up in `package.json`, for example
`"express": "^4.18.2"`. Your own project also has a version, like `1.0.0`.

## The three parts of a version

A version like `4.18.2` has three parts. This scheme is called **Semantic Versioning**
(**SemVer**), written as **MAJOR.MINOR.PATCH**:

- **MAJOR** (the `4`): breaking changes.
- **MINOR** (the `18`): new features, added in a backward-compatible way.
- **PATCH** (the `2`): backward-compatible bug fixes.

> **Correction:** The video uses non-standard names for these parts. It calls the last part
> (PATCH) a "minor fix," and the middle part (MINOR) a "recommended / security fix." The
> official SemVer names are **PATCH** (last), **MINOR** (middle), and **MAJOR** (first). Use
> these standard names, because that is what every package's docs and changelog use. Also, a
> **security fix is usually a PATCH** release, not a MINOR one. MINOR specifically means new,
> backward-compatible **features**.

### PATCH (last part)

Backward-compatible bug fixes. Small, safe changes. Updating is optional. Example: fixing a
typo in a message, or a tiny bug. Going from `4.18.2` to `4.18.3` is a patch. Nothing you rely
on should break.

### MINOR (middle part)

New functionality added in a backward-compatible way. Your existing code keeps working, and new
features become available. Going from `4.18.x` to `4.19.0` is a minor release. Recommended to
take, but it will not break you.

### MAJOR (first part)

Breaking changes. Going from `4.x.x` to `5.0.0` can break your existing code. Something in the
API changed in an incompatible way.

- If you are starting a **new** project, you can use the newest major (like Express 5).
- If you have an **existing** project on version 4, upgrading to 5 may break it. Only upgrade
  after reading the migration guide and the changelog to see what breaking changes were made.

Example given in the video: if Express 5 renamed `app.get` to `app.Get`, then all your v4 code
using `app.get` would break on v5. That is why the major number is a warning.

## Finding versions

Versions live on **npmjs.com** (the npm registry), not on the framework's own docs site. Search
for a package (like `express`) and you can see all its versions (270+ for Express) and install
any of them. Open source projects also keep a **changelog** (often `History.md` or
`CHANGELOG.md`) that lists what changed in each version, so you can read it before updating.

## Installing specific versions

```bash
npm install express            # installs the latest
npm install express@4.17.2     # installs a specific version
npm uninstall express          # removes it
```

So if Express 5 is out but you want to stay on 4, pin it: `npm install express@4.18.2`.

## The caret ^ (compatible with version)

`^4.18.2` means: **lock the MAJOR, allow MINOR and PATCH to update.**

- It allows `>=4.18.2` and `<5.0.0`.
- When you run `npm update`, npm will bump the minor and patch parts automatically (for example
  to `4.19.1`), but it will **never** jump to `5.x`, because that could break your code.

So the caret keeps the major number `4` locked and lets the safe parts float. This is npm's
default when you install a package.

## The tilde ~ (approximately equivalent to version)

`~4.18.1` means: **allow only PATCH updates, lock MAJOR and MINOR.**

- It allows `>=4.18.1` and `<4.19.0`.
- Only the last part floats (patch fixes). It will not even take a new minor like `4.19.0`.

So the tilde is stricter than the caret. The caret auto-takes minor and patch; the tilde
auto-takes only patch.

## Other patterns

- **Exact version** (no symbol): `4.18.2` means only that exact version.
- **`x` wildcard**: `4.18.x` locks major and minor, lets patch float. `4.x` locks only the
  major. `2.x` similar.
- **Ranges**: `>=1.0.0 <2.1.2`, or `1.0.0 - 2.0.0`.
- **OR** with `||`: try one range, else another.
- **`latest`**: always grabs the newest version. **Never use this.** It can silently jump you
  to a new major and break your app.

> **Note (the 0.x caveat):** The caret behaves differently when the major is `0`. `^0.11.0`
> allows `>=0.11.0 <0.12.0`, not up to `1.0.0`. When the major is 0, the software is considered
> unstable, so the caret locks the minor too. This matters for early-stage packages (like the
> `url` package at `0.11.0` from an earlier video).

## The security / hacking angle

If you are careless with version ranges, code that works today can break tomorrow:

- Using `latest` (or overly loose ranges) means a new, possibly breaking or even malicious,
  version can get pulled in without you noticing.
- Do not blindly auto-update the **major** version. Before taking a major or a recommended
  update, read the changelog, check what actually changed, look at open issues, and confirm it
  will not break your existing code. Then update deliberately.

## Summary

- SemVer is **MAJOR.MINOR.PATCH**: breaking / new features / bug fixes.
- Find and pin versions via npmjs.com; read the changelog before big updates.
- `^` locks major, floats minor and patch. `~` locks major and minor, floats only patch.
- Never use `latest`. Be careful with major upgrades, especially on existing projects.
