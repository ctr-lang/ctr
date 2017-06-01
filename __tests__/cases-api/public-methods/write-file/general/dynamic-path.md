__Description__: With the option of `dynamicPath: true` the `writeFile` should return the path to which it wrote the css result, but the path should have the `./` start and `.css` end choped off so we can do dynamic webpack requires

__Notes__

- `wrtieFile(<filePath> || <option>)`
    + `option`
        * `returnPath: <boolean>` -> returns the write file path
        * `dynamicPath: <boolean>` -> returns the write file path, without `./` start of `.css` end for dynamic webpack requires
- Uses `fs.writeFileSync`