__Description__: If a `component` object is comprised of children objects assume that each child object is a separate instance of a `component`. Furthermore, if there is no `key` key/value pair specified within the `component` child object assume the user wishes to use the object key as the `component` selector key.

__Notes__

- This is my preferred method of use since I think it's the cleanest of methods.
- Within the `component` object you cannot use any of the ctr reserved keys such as `hover`, `animation`, ...