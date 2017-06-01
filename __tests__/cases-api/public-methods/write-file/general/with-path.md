__Description__: The `writeFile` method should write the css result to the path provided which is `with-path.ctr.css` and then it should return the reffrence so we can check it againt the result.

__Notes__

+ `wrtieFile(<filePath> || <option>)`
    * `option`
        - `returnPath: <boolean>` -> returns the write file path
        - `dynamicPath: <boolean>` -> returns the write file path, without `./` start of `.css` end for dynamic webpack requires
+ Uses `fs.writeFileSync`