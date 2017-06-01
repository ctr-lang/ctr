__Description__: The `setOption` should not overwrite previous options set via `setOption` unless the option `{overwrite: true}` is passed

__Notes__

+ ctr will throw you an error to let you know that your attempting to overwrite
+ `setOption(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false, overwrite: false})`