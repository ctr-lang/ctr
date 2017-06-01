__Description__: If the only arg for `ctrSetOption` is `{rest: true}` then reset the options all together

__Notes__

+ options in `rc` if any will be merged into the reset
+ `ctrSetOption(<Object>, {reset: false, once: false})`
+ `[file].less` === less stylus syntax
+ `[file].less-yml.less` === less yaml syntax
+ YAML key regex `^ctr:::setOption` for multiple setOptions
