__Description__: This test is exactly the same as the `attribute/general/basic` test although excluding the brackets: `[` and `]`.

__Notes__

+ The reasoning is that all attribute selectors have brackets which enclose the defined attribute and some user might find this bracketless notation a bit more readable.
+ The `attribute` object is being defined within a attribute `component` since attribute selectors target attributes
+ Regex: `/(^attr$|^attribute$|^attributes$|^attr-|^attribute-|^customAttr)/i`