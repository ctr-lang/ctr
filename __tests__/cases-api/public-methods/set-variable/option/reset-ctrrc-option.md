__Description__: If reset specified and ctrrc `{reset: true, ctrrc: false}` should disregard any `.ctrrc` var

__Notes__

+ If `ctrrc: true` which is the default, uses it as the base so when reset it retains those vars set in the rc
+ `setVariable(<Object>, {reset: false, once: false, ctrrc: true, overwrite: false})`