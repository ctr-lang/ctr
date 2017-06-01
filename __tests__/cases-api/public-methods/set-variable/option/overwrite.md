__Description__: The `setVariable` should not be able to overwrite previous set variables unless `{overwrite: true}` is defined

__Notes__

+ ctr will throw you an error to let you know that your attempting to overwrite
+ `setVariable(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false})`
