__Description__: To group `non` instances together the user should be able to create a `nons` object in which each child object is treated as a separate `non` instance. If there is no `key` value pair specified within a child `non` object the `non` `<identifier>` should default to the object key.

__Notes__

+ regex: `/^nons$|^nots$|^customNos|^customNons|^customNots/i`
+ You must use the object key of `nons` to use `non` reserve keys for your child objects such as `non-span` or `not-#id` due to the nature of the current schema
+ Within the `nons` object you cannot use any of the `ctr` reserved keys that are not `non` related like `hover`, `animation`, etc.
