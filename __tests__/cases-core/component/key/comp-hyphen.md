__Description__: A `component` should be able to be defined using a the following hyphenated key notation: `comp-<selecotr>: {}`. If there's no `key` value/pair specified within the `component` object then assume that the user wants to use the hyphenated value as their key

__Notes__

- For reference, the `comp-` part of the key will just be chopped off and what's remaining will be used as the key if one is not specified
- - Regex key: `^comp-`