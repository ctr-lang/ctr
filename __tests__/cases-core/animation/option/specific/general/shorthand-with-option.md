__Description__: The user should be able to use `shorthand` in conjunction with the options specified within the `option` object

__Notes__

+ The purpose of this feature is to give the user the ability to specify options in a more direct fashion rather than having to resort to using the `default` prop a million times.
    + example: `1s ease-in default default default default paused` would just be a pain in the ass. This way you can just specify the play state within the `option` object and not have to type `default` four times.
+ If a option is specified both within the `option` object and within the `shorthand` notation the `shorthand` notation will supersede the `option` value. However, if an option value is specified within the `option` object and the `default` key is used in the `shorthand` notation then said key will inherit the specified property value defined in the `option` object
