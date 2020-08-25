# hyu

Short for "Hey, you up?", Hyu is a GitHub CLI that lets you quickly approve PRs where you have been requested for review.

I built this because having to approve 10 PRs through the GitHub UI whenever somebody submits a PR for a package update is a chore.

[![npm](https://img.shields.io/npm/v/hyu.svg?maxAge=1000)](https://www.npmjs.com/package/hyu)
[![dependency Status](https://img.shields.io/david/jeffijoe/hyu.svg?maxAge=1000)](https://david-dm.org/jeffijoe/hyu)
[![devDependency Status](https://img.shields.io/david/dev/jeffijoe/hyu.svg?maxAge=1000)](https://david-dm.org/jeffijoe/hyu)
[![Build Status](https://img.shields.io/travis/jeffijoe/hyu.svg?maxAge=1000)](https://travis-ci.org/jeffijoe/hyu)
[![Coveralls](https://img.shields.io/coveralls/jeffijoe/hyu.svg?maxAge=1000)](https://coveralls.io/github/jeffijoe/hyu)
[![npm](https://img.shields.io/npm/dt/hyu.svg?maxAge=1000)](https://www.npmjs.com/package/hyu)
[![npm](https://img.shields.io/npm/l/hyu.svg?maxAge=1000)](https://github.com/jeffijoe/hyu/blob/master/LICENSE.md)

# Install

With `npm`:

```
npm install -g hyu
```

# Usage

You'll need a [GitHub Personal Access](https://github.com/settings/tokens/new) token with the `repo` scope.

Once provided (prompted on initial invocation) it will be stored securily in your device's Keychain using [`keytar`](http://atom.github.io/node-keytar).

**Interactive approval**

```
hyu
```

**Re-enter GitHub Personal Access Token**

```
hyu auth
```

**Print help**

```
hyu --help
```

# What's in a name?

I kept getting spammed for approval on one-liners across a bunch of repositories. One such commit had the
message:

> "Hey Jeff you up? Pushing web commons"

Which was a one-liner package update. After that we would refer to those types of PRs as "Hey you up?" PRs.

Hyu = "Hey, you up?" 😄

# Author

Jeff Hansen — [@Jeffijoe](https://twitter.com/Jeffijoe)
