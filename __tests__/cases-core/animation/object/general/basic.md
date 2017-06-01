__Description__: The gist here is to allow users to specify multiple timelines within the same `animations` object. Multiple timelines within the `animations` object are defined as individual children objects of said `animations` object. Since there are multiple timelines the options for said timelines will be combined in your typical fashion: `animation-name`: `x1`, `x2`, `...`

__Notes__

+ alias: `anims`
+ This method differs from `option-a` in that the individual animations are represented via children objects within the `animations` object. While this method is more verbose it also reduces mental overhead when constructing more complex animations
+ If no `name` key/val is defined within an individual child object the `animation-name` will default to the object key
+ All children objects of the `animation` object must be associated with components. For example, you cannot place a `state` object within the `component` object
