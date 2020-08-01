# vs-alias-jump

> VS Code Extension: jump to alias file

This project forked from [this project](https://github.com/wanfu920/jumpToAliasFile).

It looks similar, but it's different.

## What's diffrent?

- Support relative path.
- Not support webpack config.

## Options

- `vs-alias-jump.alias` : add aliases here.

```
// auto replace `${folder}` to your workspace path
"vs-alias-jump.alias": {
    "@src": "${folder}/src", // relative path
    "$home": "/Users/blahblah/..." // absolute path
}
```

## Todo

- [ ] auto generated from specific config (webpack? custom?)
- [ ] check other extensions
- [ ] refactoring

## License

[MIT](LICENSE)
