__Description__: If there is a `shorthand` object in the `common` `state` object then said `shorthand` values should be applied to the in both `<selector>:<state>` and `<selector>:not(:<state>)`

__Notes__

+ There is no need for you to specify all three `shorthand` values and if you omit any it will just inherit the default set value
+ `shorthand` does not have to be defined in the `option` object and can be defined in the root
