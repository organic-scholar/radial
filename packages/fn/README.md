fn
==



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fn.svg)](https://npmjs.org/package/fn)

[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/packages/fn?branch=master&svg=true)](https://ci.appveyor.com/project/packages/fn/branch/master)
[![Codecov](https://codecov.io/gh/packages/fn/branch/master/graph/badge.svg)](https://codecov.io/gh/packages/fn)
[![Downloads/week](https://img.shields.io/npm/dw/fn.svg)](https://npmjs.org/package/fn)
[![License](https://img.shields.io/npm/l/fn.svg)](https://github.com/packages/fn/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @radial/fn
$ fn COMMAND
running command...
$ fn (-v|--version|version)
@radial/fn/0.1.9 darwin-x64 node-v8.11.3
$ fn --help [COMMAND]
USAGE
  $ fn COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fn generate [FILE] [TYPE]`](#fn-generate-file-type)
* [`fn help [COMMAND]`](#fn-help-command)

## `fn generate [FILE] [TYPE]`

generates service definitions

```
USAGE
  $ fn generate [FILE] [TYPE]

OPTIONS
  --out=out
  --type=client|server  [default: server]
```

_See code: [src/commands/generate.ts](https://github.com/packages/fn/blob/v0.1.9/src/commands/generate.ts)_

## `fn help [COMMAND]`

display help for fn

```
USAGE
  $ fn help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.0.5/src/commands/help.ts)_
<!-- commandsstop -->
