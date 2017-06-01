@depreciate -> on the chopping block, did not include in the docs and I'm just keeping this around for posible latter thoughts during the rewrite

__Description__: The user should be able to use `shorthand` option notation to define options for said timelines. The `key` for the `shorthand` notation must correspond with the defined `animation-name` for said timeline

__Notes__

+ `multiple: true` and the `shorthand` notation can either be defined within the `option` object or the user can opt to omit the `option` object and define both within the root of the `animation` object
+ The user must use the defined `animation-name`, ie they could not use `koolBrah` they must use `tlTwo`
