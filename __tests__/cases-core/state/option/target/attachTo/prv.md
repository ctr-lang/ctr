__Description__: If there is a `attachTo: 'prv'` key/value pair in the `option` object within a `state` object that is not on the root level and in `component` then the `state` will be attached to the prvious selector in the following fashion `<previous selector>:<state>` and `<previous selector>:not(:<state>)`

__Notes__

+ Alias: `previous`