__Description__: Should be able to use the `setClass` method to add a ctr-class which then can be reffrenced through the `extend` property key within a `ctr` instance.

__Parameters__

+ `setClass(<class-name>, <class-data>, <options>)`
+ `setClass({<class-name>: <class-data>}, <options>)`


__Notes__

+ Still an early implimentaitojn not so this may or may not change
+ The idea of the `setClass` is the same as extending a CtrClass in Stylus.
+ The end game gist is this that classes give you the ability to move away from multiple classes within your `HTML` to a more `CSS` centric design paradigm.
    - One of the best examples is in bootstrap, to create a large primary button your HTML class would look like this: `class="btn btn-primary btn-lg"` what an ugly mess my mother would say. Furthermore, if you wanted to turn the `border-radius` to `2px` you would have to tack on another class. `extend` allows you to create thoses css classes as `CtrClass`'s.




