__Description__: The idea of a `preset` is pretty simple, just like the presets on your raido, they are saved configurations for classes. The presets are defined in the local var Object with a Object key of `preset`, then the child Objects are the defined presets. To use/apply a `preset` `extend` the `class` and then define a `preset` key with an String or an Array of String that represnt the `presets` you wan to apply

```
extend: {
  <class-key>: {
    preset: <preset> || [<preset>, <preset>]
  }
}
```

__Notes__

+ The same results could be achived though using multiple classes as well although this method condeses the logic a bit better
+ Under the hood all that is happening is the preset Object is getting merge into the local var thus overwriting the props/var, nothing too special
+ Order sensitive like classes, low index trumps