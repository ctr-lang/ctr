__Description__: A `attribute` should be able to be defined using a the following hyphenated key notation: `attr-<attribute>: {}`. If there's no `key` value/pair specified within the `attribute` object then assume that the user wants to use the hyphenated value as their attribute key

__Notes__

- For reference, the `attr-` part of the key will just be chopped off and what's remaining will be used as the key if one is not specified
- If the attribute brackets are omitted they will be generated for you
- For the tests, I'm defining  the `attribute` object within an attribute `component` since attribute selectors target attributes.
- Regex key: `^attr-`