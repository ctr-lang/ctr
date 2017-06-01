__Description__: Proper inheritance within Stylus? You betcha! This test presents a problem because both `$height` and `$width` share a common `size` local-variable. Now I don't have time to make sure there is no variable conflicts between individual `extend`'s and I'll assume you don't either. And while you can specify changes to individual `extend` variables it would be nice if you could change common variables in one fatal swoop. With the `$$global$$` object you can do just that. All variable that are specified within the `$$global$$` object will be applied to all `extend` instances if that variable is present within said `extend`.

__Notes__

- This idea has not been fleshed out completely. Nevertheless, it's my best thought as of right now how to handle this in Stylus
