__Description__: A `element` should be able to be defined using a the following hyphenated key notation: `element-<element>: {}`. If there's no `key` value/pair specified within the `element` object then assume that the user wants to use the hyphenated value as their key

__Notes__

- For reference, the `element-` part of the key will just be chopped off and what's remaining will be used as the key if one is not specified
- - Regex key: `/^element-/i`