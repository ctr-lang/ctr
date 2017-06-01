__Description__: If a `elements` object is comprised of children objects assume that each child object is a separate instance of a `element`. Furthermore, if there is no `key` key/value pair specified within the `element` child object assume the user wishes to use the object key as the `element` selector key.

__Notes__

- alias: ` /^elms$|^elements$|^customEls|^customElms|^customElements/i`
- You must use the key of `elements` for the object the other keys will not work due to the nature of the current schema of reserved `element` keys such as `after`
- This is my preferred method of use since I think it's the cleanest of methods.
- Within the `element` object you cannot use any of the ctr reserved keys such as `hover`, `animation`, ...
