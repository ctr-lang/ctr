__Description__: If a `components` object is comprised of children objects assume that each child object is a separate instance of a `component`. Furthermore, if there is no `key` key/value pair specified within the `component` child object assume the user wishes to use the object key as the `component` selector key.


__Notes__

+ reges: `/^comps$|^components$|^customCos|^customComps|^customComponents/i`
+ All children objects of the `component` object must be associated with components. For example, you cannot place a `state` object within the `component` object
