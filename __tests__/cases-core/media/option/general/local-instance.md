__Description__: The user should be able to modify media defaults locally on an individual `ctr` instance basis through the root `option.media` object

__Notes__

- This feature comes in handy when creating custom `CtrClass`'s which have and you what to create some default media breakpoints that don't pollute the global scope
- The global options of `checkLocally` must set to `true` which it is by default for this to work
