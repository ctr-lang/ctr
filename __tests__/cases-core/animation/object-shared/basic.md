@depreciate -> on the chopping block, did not include in the docs and I'm just keeping this around for posible latter thoughts during the rewrite

__Description__: The gist here is users should be able to specify multiple `timeline`'s within the same `animation` object. In order to use this notation the user must declare `multiple: true` within the root of the `animation` object. The multiple timelines are defined in the `timeline` object and are be represented as individual objects. Since there are multiple timelines the options for said timelines will be combined in your typical fashion: `animation-name`: `x1`, `x2`, `...`


__Notes__

+ This method differs from `option-b` in that the multiple `timeline`'s share a common parent `option` object. If used properly this can allow the user to use the `option` object and or `shorthand` notation so that their intentions are better defined and a bit more concise
+ The `animation-name` property can either be defined within the individual `timeline` object via the `name` key. If no `name` key is defined then the name will default to the key which represents the defined individual timeline
