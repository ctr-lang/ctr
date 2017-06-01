__Description__: Should be able to implement the a custom callback just once through a second option of `{once: true}`. The callback will be set for just once set and then they will revet back to whatever it was before.

__Note__

+ Unless you are 100% sure you know what you are doing you probs want to use `setTransform` to transform the results.
+ I'm on the fence about this callback business it might do more harm than good. But power to the people.
+ `setCallback(<Function>, {reset: false, once: false})`
