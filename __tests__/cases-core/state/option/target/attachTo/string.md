__Description__: If there is a `attachTo: <string>` key/value pair in the `option` object within a `state` object that is not on the root level and in `component` then the `state` will be attached to the matching previous `component` string in the following fashion `<selector string>:<state>` and `<selector string>:not(:<state>)`

__Notes__

+ You can omit the class or id prefix