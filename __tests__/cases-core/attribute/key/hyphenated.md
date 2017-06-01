__Description__: An attribute should be able to be defined using a the following hyphenated key notation: `attr-<attribute>`

__Notes__

- For reference, the `attr-` part of the key will just be chopped off
- This notation cannot be used with an `attribute` object
- If the attribute brackets are omitted they will be generated for you
- For the tests, I'm defining  the `attribute` object within an attribute `component` since attribute selectors target attributes.