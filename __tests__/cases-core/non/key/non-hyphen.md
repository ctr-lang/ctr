__Description__: A `non` element should be able to be defined using a the following hyphenated key notation: `non-<element>: {}`. If there's no `key` value/pair specified within the `non` object then assume that the user wants to use the hyphenated value as their key

__Notes__

- For reference, the `non-` part of the key will just be chopped off and what's remaining will be used as the key if one is not specified
- Regex key: `/^non-|^not-/i`