@depreciate -> on the chopping block, did not include in the docs and I'm just keeping this around for posible latter thoughts during the rewrite

__Description__: Within the `option` object users should have the option to define child objects whose `key`'s' are affiliated with a corresponding `timeline` thus allowing the user to define individual specific options

__Notes__

+ As noted above in order for the child `option` objects to be applied to a specific `timeline` within the `option` object their `key` must correspond with the `name` of the timeline
+ All options that are specified in the global sense of the `option` object will be inherited by all children object options, although, child specific options will supersede global options
